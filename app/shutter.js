'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.all(/\b(?!offline)\b\S+/, (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_caveats_shutter', featureToggle.toggleExistingPage, 'offline'));
router.all(/offline/, (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_caveats_shutter', featureToggle.togglePage, 'start-apply'));

module.exports = router;
