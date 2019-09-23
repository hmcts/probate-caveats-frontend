'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.all(/\b(?!offline)\b\S+/, (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'caveats_shutter_toggle', featureToggle.toggleExistingPage, 'offline'));
router.all(/offline/, (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'caveats_shutter_toggle', featureToggle.togglePage, 'start-apply'));

module.exports = router;
