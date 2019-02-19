'use strict';

const router = require('express').Router();
const commonContent = require('app/resources/en/translation/common');
const pdfservices = require('app/components/pdf-services');

router.get('/check-answers-pdf', getCheckAnswersPdf);

function getCheckAnswersPdf(req, res) {
    const formdata = req.session.form;
    pdfservices.createCheckAnswersPdf(formdata, req.session.id)
        .then(result => {
            setPDFHeadingValuesAndSend(res, result, 'checkYourAnswers.pdf');
        })
        .catch(err => {
            throwPDFException(req, res, err);
        });
}

function setPDFHeadingValuesAndSend(res, result, filename) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.send(result);
}

function throwPDFException(req, res, err) {
    req.log.error(err);
    res.status(500);
    res.render('errors/500', {common: commonContent});
}

module.exports = {
    router,
    getCheckAnswersPdf
};
