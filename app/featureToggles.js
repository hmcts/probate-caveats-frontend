'use strict';

const config = require('config');
const router = require('express').Router();
const FeatureToggle = require('app/utils/FeatureToggle');
const featureToggle = new FeatureToggle();

router.all('/equality-and-diversity', (req, res, next) => featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_pcq', featureToggle.togglePage, `${config.app.basePath}/summary`));

module.exports = router;
