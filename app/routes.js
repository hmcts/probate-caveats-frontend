import {get, includes} from 'lodash';

import FormatUrl from './utils/FormatUrl.js';
import config from 'config';
import documentDownloads from './documentDownloads.js';
import express from 'express';
import featureToggles from './featureToggles.js';
import initSteps from './core/initSteps.js';
import lockPaymentAttempt from './middleware/lockPaymentAttempt.js';
import logger from './components/logger.js';
import paymentFees from './paymentFees.js';
import shutter from './shutter.js';
import {v4 as uuidv4} from 'uuid';

const router = express.Router();

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

export default router;
