'use strict';

const router = require('express').Router();
const lookupPaymentFees = require('app/middleware/lookupPaymentFees');

router.get('/payment-breakdown', (req, res, next) => lookupPaymentFees(req, res, next));

module.exports = router;
