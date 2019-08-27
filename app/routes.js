'use strict';

const config = require('app/config');
const router = require('express').Router();
const initSteps = require('app/core/initSteps');
const logger = require('app/components/logger');
const {get, includes} = require('lodash');
const documentDownloads = require('app/documentDownloads');
const paymentFees = require('app/paymentFees');
const lockPaymentAttempt = require('app/middleware/lockPaymentAttempt');
const uuidv4 = require('uuid/v4');
const shutter = require('app/shutter');
const featureToggles = require('app/featureToggles');

router.use(shutter);
router.use(featureToggles);

router.all('*', (req, res, next) => {
    const applicationId = get(req.session.form, 'applicationId', 'init');
    req.log = logger(applicationId);
    req.log.info(`Processing ${req.method} for ${req.originalUrl}`);
    next();
});

router.use((req, res, next) => {
    if (!req.session.form) {
        req.session.form = {
            payloadVersion: config.payloadVersion,
            applicationId: uuidv4()
        };
        req.session.back = [];
    }
    next();
});

router.get('/', (req, res) => {
    req.log.info({tags: 'Analytics'}, 'Application Started');
    res.redirect(`${config.app.basePath}/start-page`);
});

router.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.pageUrl = req.url;
    next();
});

router.use(documentDownloads);
router.use(paymentFees);

router.post(`${config.app.basePath}/payment-breakdown`, lockPaymentAttempt);

router.get('/*', (req, res, next) => {
    const formdata = req.session.form;
    if (!includes(config.whiteListedPagesForThankyou, req.originalUrl) &&
        get(formdata, 'payment.status') === 'Success') {
        res.redirect(`${config.app.basePath}/thank-you`);
    } else if (!includes(config.whitelistedPagesForStartPageRedirect, req.originalUrl) &&
        get(formdata, 'applicant.firstName', '') === '') {
        res.redirect(`${config.app.basePath}/start-page`);
    } else if (!includes(config.whiteListedPagesForPaymentBreakdown, req.originalUrl) &&
        get(formdata, 'ccdCase.id', '') !== '') {
        res.redirect(`${config.app.basePath}/payment-breakdown`);
    } else {
        next();
    }
});

const steps = initSteps([`${__dirname}/steps/action/`, `${__dirname}/steps/ui/`]);

Object.entries(steps).forEach(([, step]) => {
    router.get(step.constructor.getUrl(), step.runner().GET(step));
    router.post(step.constructor.getUrl(), step.runner().POST(step));
});

router.get('/health/liveness', (req, res) => {
    res.json({status: 'UP'});
});

module.exports = router;
