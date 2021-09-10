'use strict';

const config = require('config');
const router = require('express').Router();
const initSteps = require('app/core/initSteps');
const logger = require('app/components/logger');
const {get, includes} = require('lodash');
const documentDownloads = require('app/documentDownloads');
const paymentFees = require('app/paymentFees');
const lockPaymentAttempt = require('app/middleware/lockPaymentAttempt');
const {v4: uuidv4} = require('uuid');
const featureToggles = require('app/featureToggles');
const shutter = require('app/shutter');
const FormatUrl = require('app/utils/FormatUrl');

router.use(featureToggles);
router.use(shutter);

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
    res.redirect(`${config.app.basePath}/start-apply`);
});

const allSteps = {
    'en': initSteps([`${__dirname}/steps/action/`, `${__dirname}/steps/ui`], 'en'),
    'cy': initSteps([`${__dirname}/steps/action/`, `${__dirname}/steps/ui`], 'cy')
};

router.use((req, res, next) => {
    const steps = allSteps[req.session.language];

    Object.entries(steps).forEach(([, step]) => {
        router.get(step.constructor.getUrl(), step.runner().GET(step));
        router.post(step.constructor.getUrl(), step.runner().POST(step));
    });

    res.locals.session = req.session;
    res.locals.pageUrl = req.url;
    next();
});

router.use(documentDownloads);
router.use(paymentFees);

router.post(`${config.app.basePath}/payment-breakdown`, lockPaymentAttempt);

router.get('/*', (req, res, next) => {
    const formdata = req.session.form;
    let currentPageCleanUrl;
    if (config.app.basePath !== '') {
        currentPageCleanUrl = FormatUrl.getCleanPageUrl(req.originalUrl, 2);
    } else {
        currentPageCleanUrl = FormatUrl.getCleanPageUrl(req.originalUrl, 1);
    }

    if (!includes(config.whiteListedPagesForThankyou, currentPageCleanUrl) && get(formdata, 'payment.status') === 'Success') {
        res.redirect(`${config.app.basePath}/thank-you`);
    } else if (!includes(config.whitelistedPagesForStartApplyPageRedirect, currentPageCleanUrl) && get(formdata, 'applicant.firstName', '') === '') {
        res.redirect(`${config.app.basePath}/start-apply`);
    } else if (!includes(config.whiteListedPagesForPaymentBreakdown, currentPageCleanUrl) && get(formdata, 'ccdCase.id', '') !== '') {
        res.redirect(`${config.app.basePath}/payment-breakdown`);
    } else {
        next();
    }
});

module.exports = router;
