'use strict';

const commonContent = require('app/resources/en/translation/common');
const pdfservices = require('app/components/pdf-services');

const downloadCheckAnswersPdf = (req, res) => {
    const formdata = req.session.form;
    pdfservices.createCheckAnswersPdf(formdata, req.session.id)
        .then(result => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-disposition', 'attachment; filename=checkYourAnswers.pdf');
            res.send(result);
        })
        .catch(err => {
            req.log.error(err.toLocaleString());
            res.status(500);
            res.render('errors/500', {common: commonContent});
        });
};

module.exports = downloadCheckAnswersPdf;
