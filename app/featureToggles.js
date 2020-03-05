'use strict';

const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.all('/equality-and-diversity', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'pcq_toggle', featureToggle.togglePage, '/summary/*'));

module.exports = router;
