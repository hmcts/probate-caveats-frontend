'use strict';

const router = require('express').Router();
const checkHealthAndCreatePCQid = require('app/middleware/checkHealthAndCreatePCQid');

router.get('/equality-and-diversity', (req, res, next) => checkHealthAndCreatePCQid(req, res, next));

module.exports = router;
