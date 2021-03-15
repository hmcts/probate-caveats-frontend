'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();
const completeEqualityTask = require('app/middleware/completeEqualityTask');

router.get('/equality-and-diversity', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_pcq', completeEqualityTask));
router.get('/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_avaya_webchat', featureToggle.toggleFeature));
router.all('/payment-breakdown', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_newfee_register_code', featureToggle.toggleFeature));

module.exports = router;
