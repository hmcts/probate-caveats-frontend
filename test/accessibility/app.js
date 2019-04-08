'use strict';

const express = require('express');
const app = express();
const session = require('express-session');
const nunjucks = require('express-nunjucks');
const config = require('test/config');
const commonContent = require('app/resources/en/translation/common');

exports.init = function() {
    app.set('view engine', 'html');
    app.set('views', ['app/steps', 'app/views', 'node_modules/govuk_template_jinja/views/layouts']);

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

    const globals = {
        'currentYear': new Date().getFullYear(),
        'gaTrackingId': config.gaTrackingId,
        'enableTracking': config.enableTracking,
        'links': config.links,
        'helpline': config.helpline
    };

    const njk = nunjucks(app, {
        autoescape: true,
        watch: true,
        noCache: true,
        globals: globals
    });
    const filters = require('app/components/filters.js');
    filters(njk.env);

    // Add variables that are available in all views
    app.use(function (req, res, next) {
        res.locals.serviceName = commonContent.serviceName;
        next();
    });

    return app;

};
