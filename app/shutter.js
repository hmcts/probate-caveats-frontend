'use strict';

const config = require('app/config');
const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.all(/\b(?!offline)\b\S+/, (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'caveats_shutter_toggle', featureToggle.toggleExistingPage, `${config.app.basePath}/offline`));
router.all(/offline/, (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'caveats_shutter_toggle', featureToggle.togglePage, `${config.app.basePath}/start-apply`));

module.exports = router;
