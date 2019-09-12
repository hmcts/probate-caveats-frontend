'use strict';

const express = require('express');
const app = express();
const session = require('express-session');
const nunjucks = require('nunjucks');
const config = require('test/config');
const commonContent = require('app/resources/en/translation/common');

exports.init = function() {
    app.set('view engine', 'html');
    app.set('views', ['app/steps', 'app/views']);

    // Support session data
    app.use(session({
        resave: config.redis.resave,
        saveUninitialized: config.redis.saveUninitialized,
        secret: 'secret'
    }));
    app.use((req, res, next) => {
        req.session.form = {};
        req.session.back = [];
        next();
    });

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
        helpline: config.helpline
    };
    njkEnv.addGlobal('globals', globals);

    // Add variables that are available in all views
    app.use(function (req, res, next) {
        res.locals.serviceName = commonContent.serviceName;
        next();
    });

    return app;
};
