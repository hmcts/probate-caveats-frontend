/* eslint no-console: 0 no-unused-vars: 0 */

'use strict';

const logger = require('app/components/logger');
const path = require('path');
const express = require('express');
const rewrite = require('express-urlrewrite');
const session = require('express-session');
const nunjucks = require('nunjucks');
const routes = require(`${__dirname}/app/routes`);
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('config');
const utils = require(`${__dirname}/app/components/utils`);
const packageJson = require(`${__dirname}/package`);
const helmet = require('helmet');
const hpkp = require('hpkp');
const nocache = require('nocache');
const csrf = require('csurf');
const setupHealthCheck = require('app/utils/setupHealthCheck');
const fs = require('fs');
const https = require('https');
const {v4: uuidv4} = require('uuid');
const nonce = uuidv4().replace(/-/g, '');
const isEmpty = require('lodash').isEmpty;
const featureToggles = require('app/featureToggles');
const {getContentSecurityPolicy} = require('./app/utils/getContentSecurityPolicy');
const {sanitizeInput} = require('./app/utils/Sanitize');
const {merge} = require('lodash');

exports.init = function(isA11yTest = false, a11yTestSession = {}, ftValue) {
    const app = express();
    const port = config.app.port;
    const releaseVersion = packageJson.version;

    // Application settings
    app.set('view engine', 'html');
    app.set('views', ['app/steps', 'app/views']);

    const isDev = app.get('env') === 'development';

    const njkEnv = nunjucks.configure([
        'app/steps',
        'app/views',
        'node_modules/govuk-frontend/dist/'
    ], {
        noCache: isDev,
        express: app
    });

    const globals = {
        currentYear: new Date().getFullYear(),
        enableTracking: config.enableTracking,
        links: config.links,
        applicationFee: config.payment.applicationFee,
        nonce: nonce,
        basePath: config.app.basePath,
        webchat: {
            avayaUrl: config.webchat.avayaUrl,
            avayaClientUrl: config.webchat.avayaClientUrl,
            avayaService: config.webchat.avayaService,
            kerv: {
                deploymentId: {
                    en: config.webchat.kerv.deploymentId.en,
                    cy: config.webchat.kerv.deploymentId.cy,
                },
                genesysBaseUrl: config.webchat.kerv.genesysBaseUrl,
                environment: config.webchat.kerv.environment,
                kervBaseUrl: config.webchat.kerv.kervBaseUrl,
                apiKey: config.webchat.kerv.apiKey,
            },
        },
    };

    njkEnv.addGlobal('globals', globals);

    app.use(rewrite(`${globals.basePath}/public/*`, '/public/$1'));

    app.enable('trust proxy');

    // Security library helmet to verify 11 smaller middleware functions
    app.use(helmet());

    // Content security policy to allow just assets from same domain
    app.use(helmet.contentSecurityPolicy(getContentSecurityPolicy(nonce)));

    // Http public key pinning
    app.use(hpkp({
        maxAge: 900,
        sha256s: ['AbCdEf123=', 'XyzABC123=']
    }));

    // Referrer policy for helmet
    app.use(helmet.referrerPolicy({
        policy: 'origin'
    }));

    app.use(nocache());

    app.use(helmet.strictTransportSecurity({
        maxAge: 31536000,
    }));

    app.use(helmet.xssFilter({setOnOldIE: true}));

    app.use((req, res, next) => {
        res.header('X-Robots-Tag', 'noindex');
        next();
    });

    const caching = {cacheControl: true, setHeaders: (res) => res.setHeader('Cache-Control', 'max-age=604800')};

    // Middleware to serve static assets
    app.use('/public/stylesheets', express.static(`${__dirname}/public/stylesheets`, caching));
    app.use('/public/images', express.static(`${__dirname}/app/assets/images`, caching));
    app.use('/public/javascripts/govuk-frontend', express.static(`${__dirname}/node_modules/govuk-frontend/dist`, caching));
    app.use('/public/javascripts', express.static(`${__dirname}/app/assets/javascripts`, caching));
    app.use('/public/pdf', express.static(`${__dirname}/app/assets/pdf`));
    app.use('/assets', express.static(`${__dirname}/node_modules/govuk-frontend/dist/govuk/assets`, caching));
    app.use('/public/locales', express.static(`${__dirname}/app/assets/locales`, caching));
    app.use('/assets/locale', express.static(`${__dirname}/app/assets/locales/avaya-webchat`, caching));

    // Elements refers to icon folder instead of images folder
    app.use(favicon(path.join(__dirname, 'node_modules', 'govuk-frontend', 'dist', 'govuk', 'assets', 'images', 'favicon.ico')));

    // Support for parsing data in POSTs
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieParser());

    // Send assetPath to all views
    app.use((req, res, next) => {
        res.locals.asset_path = `${globals.basePath}/public/`;
        next();
    });

    // Support session data
    app.use(session({
        proxy: config.redis.proxy,
        resave: config.redis.resave,
        saveUninitialized: config.redis.saveUninitialized,
        secret: config.redis.secret,
        cookie: {
            httpOnly: config.redis.cookie.httpOnly,
            sameSite: config.redis.cookie.sameSite
        },
        store: utils.getStore(config.redis, session)
    }));

    app.use((req, res, next) => {
        if (!req.session) {
            return next(new Error('Unable to reach redis'));
        }

        if (isA11yTest && !isEmpty(a11yTestSession)) {
            const safeA11yTestSession = sanitizeInput(a11yTestSession);
            req.session = merge(req.session, safeA11yTestSession);
        }

        next();
    });

    app.use((req, res, next) => {
        req.session.cookie.secure = req.protocol === 'https';
        next();
    });

    app.use((req, res, next) => {
        if (!req.session.language) {
            req.session.language = 'en';
        }

        if (req.query) {
            if (req.query.lng && config.languages.includes(req.query.lng)) {
                req.session.language = req.query.lng;
            } else if (req.query.locale && config.languages.includes(req.query.locale)) {
                req.session.language = req.query.locale;
            }
        }

        if (isA11yTest && !isEmpty(a11yTestSession)) {
            const safeA11yTestSession = sanitizeInput(a11yTestSession);
            req.session = merge(req.session, safeA11yTestSession);
        }

        next();
    });

    if (config.app.useCSRFProtection === 'true') {
        app.use((req, res, next) => {
            // Exclude Dynatrace Beacon POST requests from CSRF check
            if (req.method === 'POST' && req.path.startsWith('/rb_')) {
                next();
            } else {
                csrf({})(req, res, next);
            }
        });

        app.use((req, res, next) => {
            if (req.csrfToken) {
                res.locals.csrfToken = req.csrfToken();
            }
            next();
        });
    }

    // Add variables that are available in all views
    app.use((req, res, next) => {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);

        res.locals.serviceName = commonContent.serviceName;
        res.locals.cookieText = commonContent.cookieText;
        res.locals.releaseVersion = 'v' + releaseVersion;
        next();
    });

    // health
    setupHealthCheck(app);
    app.get(`${config.app.basePath}/health/liveness`, (req, res) => res.json({status: 'UP'}));
    app.get(`${config.app.basePath}/health/readiness`, (req, res) => res.json({status: 'UP'}));

    app.use((req, res, next) => {
        res.locals.launchDarkly = {};
        if (ftValue) {
            res.locals.launchDarkly.ftValue = ftValue;
        }
        next();
    });

    app.use(`${config.app.basePath}/`, (req, res, next) => {
        if (req.query.id && req.query.id !== req.session.regId) {
            delete req.session.form;
        }
        req.session.regId = req.query.id || req.session.regId || req.sessionID;
        next();
    }, routes);

    app.use(featureToggles);

    // Start the app
    let http;

    if (['development', 'testing'].includes(config.nodeEnvironment)) {
        const sslDirectory = path.join(__dirname, 'app', 'resources', 'localhost-ssl');
        const sslOptions = {
            key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
            cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
            secureProtocol: 'TLSv1_2_method'
        };
        const server = https.createServer(sslOptions, app);

        http = server.listen(port, () => {
            console.log(`Application started: http://localhost:${port}${config.app.basePath}`);
        });
    } else {
        http = app.listen(port, () => {
            console.log(`Application started: http://localhost:${port}${config.app.basePath}`);
        });
    }

    app.all('*', (req, res) => {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);
        const content = require(`app/resources/${req.session.language}/translation/errors/404`);

        logger(req.sessionID).error(`Unhandled request ${req.url}`);
        res.status(404).render('errors/error', {common: commonContent, content: content, error: '404'});
    });

    app.use((err, req, res, next) => {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);
        const content = require(`app/resources/${req.session.language}/translation/errors/500`);

        logger(req.sessionID).error(err);
        res.status(500).render('errors/error', {common: commonContent, content: content, error: '500'});
    });

    return {app, http};
};
