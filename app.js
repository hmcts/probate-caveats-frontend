'use strict';

/* eslint no-console: 0 no-unused-vars: 0 */

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
const config = require(`${__dirname}/app/config`);
const utils = require(`${__dirname}/app/components/utils`);
const packageJson = require(`${__dirname}/package`);
const helmet = require('helmet');
const csrf = require('csurf');
const healthcheck = require(`${__dirname}/app/healthcheck`);
const fs = require('fs');
const https = require('https');
const appInsights = require('applicationinsights');
const commonContent = require('app/resources/en/translation/common');
const uuidv4 = require('uuid/v4');
const uuid = uuidv4();

exports.init = function() {
    const app = express();
    const port = config.app.port;
    const releaseVersion = packageJson.version;
    const useHttps = config.app.useHttps.toLowerCase();

    if (config.appInsights.instrumentationKey) {
        appInsights.setup(config.appInsights.instrumentationKey);
        appInsights.start();
    }

    // Application settings
    app.set('view engine', 'html');
    app.set('views', ['app/steps', 'app/views']);

    const isDev = app.get('env') === 'development';

    const njkEnv = nunjucks.configure([
        'app/steps',
        'app/views',
        'node_modules/govuk-frontend/'
    ], {
        noCache: isDev,
        express: app
    });

    const globals = {
        currentYear: new Date().getFullYear(),
        gaTrackingId: config.gaTrackingId,
        enableTracking: config.enableTracking,
        links: config.links,
        helpline: config.helpline,
        applicationFee: config.payment.applicationFee,
        nonce: uuid,
        basePath: config.app.basePath,
        webChat: {
            chatId: config.webChat.chatId,
            tenant: config.webChat.tenant,
            buttonNoAgents: config.webChat.buttonNoAgents,
            buttonAgentsBusy: config.webChat.buttonAgentsBusy,
            buttonServiceClosed: config.webChat.buttonServiceClosed
        }
    };
    njkEnv.addGlobal('globals', globals);

    app.use(rewrite(`${globals.basePath}/public/*`, '/public/$1'));

    app.enable('trust proxy');

    // Security library helmet to verify 11 smaller middleware functions
    app.use(helmet());

    // Content security policy to allow just assets from same domain
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ['\'self\''],
            fontSrc: ['\'self\' data:'],
            scriptSrc: [
                '\'self\'',
                '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\'',
                '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\'',
                '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\'',
                'www.google-analytics.com',
                'vcc-eu4.8x8.com',
                'vcc-eu4b.8x8.com',
                `'nonce-${uuid}'`
            ],
            connectSrc: ['\'self\''],
            mediaSrc: ['\'self\''],
            frameSrc: [
                'vcc-eu4.8x8.com',
                'vcc-eu4b.8x8.com'
            ],
            imgSrc: [
                '\'self\'',
                'www.google-analytics.com',
                'vcc-eu4.8x8.com',
                'vcc-eu4b.8x8.com'
            ],
            styleSrc: [
                '\'self\'',
                '\'unsafe-inline\''
            ],
            frameAncestors: ['\'self\'']
        },
        browserSniff: true,
        setAllHeaders: true
    }));

    // Http public key pinning
    app.use(helmet.hpkp({
        maxAge: 900,
        sha256s: ['AbCdEf123=', 'XyzABC123=']
    }));

    // Referrer policy for helmet
    app.use(helmet.referrerPolicy({
        policy: 'origin'
    }));

    app.use(helmet.noCache());

    app.use(helmet.xssFilter({setOnOldIE: true}));

    const caching = {cacheControl: true, setHeaders: (res) => res.setHeader('Cache-Control', 'max-age=604800')};

    // Middleware to serve static assets
    app.use('/public/webchat', express.static(`${__dirname}/node_modules/@hmcts/ctsc-web-chat/assets`, caching));
    app.use('/public/stylesheets', express.static(`${__dirname}/public/stylesheets`, caching));
    app.use('/public/images', express.static(`${__dirname}/app/assets/images`, caching));
    app.use('/public/javascripts/govuk-frontend', express.static(`${__dirname}/node_modules/govuk-frontend`, caching));
    app.use('/public/javascripts', express.static(`${__dirname}/app/assets/javascripts`, caching));
    app.use('/public/pdf', express.static(`${__dirname}/app/assets/pdf`));
    app.use('/assets', express.static(`${__dirname}/node_modules/govuk-frontend/govuk/assets`, caching));

    // Elements refers to icon folder instead of images folder
    app.use(favicon(path.join(__dirname, 'node_modules', 'govuk-frontend', 'govuk', 'assets', 'images', 'favicon.ico')));

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
        req.session.cookie.secure = req.protocol === 'https';
        next();
    });

    app.use((req, res, next) => {
        if (!req.session) {
            return next(new Error('Unable to reach redis'));
        }
        next(); // otherwise continue
    });

    if (config.useCSRFProtection === 'true') {
        app.use(csrf(), (req, res, next) => {
            res.locals.csrfToken = req.csrfToken();
            next();
        });
    }

    // Add variables that are available in all views
    app.use(function (req, res, next) {
        res.locals.serviceName = commonContent.serviceName;
        res.locals.cookieText = commonContent.cookieText;
        res.locals.releaseVersion = 'v' + releaseVersion;
        next();
    });

    // Force HTTPs on production connections
    if (useHttps === 'true') {
        app.use(utils.forceHttps);
    }

    app.use('/health', healthcheck);

    app.use(`${config.app.basePath}/health`, healthcheck);

    app.use(`${config.livenessEndpoint}`, (req, res) => {
        res.json({status: 'UP'});
    });

    app.use(`${config.app.basePath}/`, (req, res, next) => {
        if (req.query.id && req.query.id !== req.session.regId) {
            delete req.session.form;
        }
        req.session.regId = req.query.id || req.session.regId || req.sessionID;
        next();
    }, routes);

    // Start the app
    let http;

    if (['development', 'testing'].includes(config.nodeEnvironment)) {
        const sslDirectory = path.join(__dirname, 'app', 'resources', 'localhost-ssl');
        const sslOptions = {
            key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
            cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
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
        logger(req.sessionID).error(`Unhandled request ${req.url}`);
        res.status(404).render('errors/404');
    });

    app.use((err, req, res, next) => {
        logger(req.sessionID).error(err);
        res.status(500).render('errors/500');
    });

    return {app, http};
};
