'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.get('/bilingual-gop', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'welsh_ft', featureToggle.togglePage, '/applicant-name'));
router.all('*', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'welsh_ft', featureToggle.toggleFeature));

module.exports = router;
