'use strict';

const router = require('express').Router();
const downloadCheckAnswersPdf = require('app/middleware/downloadCheckAnswersPdf');

router.get('/check-answers-pdf', (req, res) => downloadCheckAnswersPdf(req, res));

module.exports = router;
