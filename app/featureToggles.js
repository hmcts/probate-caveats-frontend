'use strict';

const config = require('config');
const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.all('/equality-and-diversity', (req, res, next) => featureToggle.callCheckToggle(req, res, next, 'pcq_toggle', featureToggle.togglePage, `${config.app.basePath}/summary/*`));

module.exports = router;
