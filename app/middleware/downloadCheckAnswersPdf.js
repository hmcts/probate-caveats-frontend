'use strict';

const pdfservices = require('app/components/pdf-services');
const formatUrl = require('app/utils/FormatUrl');

const downloadCheckAnswersPdf = (req, res) => {
    const commonContent = require(`app/resources/${req.session.language}/translation/common`);
    const formdata = req.session.form;
    const hostname = formatUrl.createHostname(req);

    pdfservices.createCheckAnswersPdf(formdata, req.session.id, hostname)
        .then(result => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-disposition', 'attachment; filename=checkYourAnswers.pdf');
            res.send(result);
        })
        .catch(err => {
            req.log.error(err.toLocaleString());
            res.status(500);
            res.render('errors/error', {common: commonContent, error: '500'});
        });
};

module.exports = downloadCheckAnswersPdf;
