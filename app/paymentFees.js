'use strict';

const router = require('express').Router();
const lookupFees = require('app/middleware/lookupFees');

router.get('/payment-breakdown', (req, res, next) => lookupFees(req, res, next));

module.exports = router;
