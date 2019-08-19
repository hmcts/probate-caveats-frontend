'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.get('/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'webchat', featureToggle.toggleFeature));
router.get('/*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'webforms', featureToggle.toggleFeature));

module.exports = router;
