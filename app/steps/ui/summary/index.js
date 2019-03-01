'use strict';

const Step = require('app/core/steps/Step');
const isEmpty = require('lodash').isEmpty;
const FormatName = require('app/utils/FormatName');
const CheckAnswersSummaryJSONObjectBuilder = require('app/utils/CheckAnswersSummaryJSONObjectBuilder');
const checkAnswersSummaryJSONObjBuilder = new CheckAnswersSummaryJSONObjectBuilder();
const {set} = require('lodash');
const logger = require('app/components/logger')('Init');
const FieldError = require('app/components/error');
const services = require('app/components/services');
const security = require('app/components/security');
const config = require('app/config');

class Summary extends Step {

    static getUrl(redirect = '*') {
        return `/summary/${redirect}`;
    }

    generateContent (ctx, formdata) {
        const content = {};

        Object.keys(this.steps)
            .filter((stepName) => stepName !== this.name)
            .forEach((stepName) => {
                const step = this.steps[stepName];
                content[stepName] = step.generateContent(formdata[step.section], formdata);
                content[stepName].url = step.constructor.getUrl();
            });
        content[this.name] = super.generateContent(ctx, formdata);
        content[this.name].url = Summary.getUrl();
        const deceasedName = FormatName.format(formdata.deceased);
        content.DeceasedAlias.question = content.DeceasedAlias.question.replace('{deceasedName}', deceasedName ? deceasedName : content.DeceasedAlias.theDeceased);
        return content;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.redirect_url = security.getRedirectUrl(req);
        return ctx;
    }

    generateFields (ctx, errors, formdata) {
        const fields = {};
        Object.keys(this.steps)
            .filter((stepName) => stepName !== this.name)
            .forEach((stepName) => {
                const step = this.steps[stepName];
                if (isEmpty(fields[step.section])) {
                    fields[step.section] = step.generateFields(formdata[step.section], errors, formdata);
                }
            });
        fields[this.section] = super.generateFields(ctx, errors, formdata);
        return fields;
    }

    renderPage(res, html) {
        const formdata = res.req.session.form;
        formdata.checkAnswersSummary = checkAnswersSummaryJSONObjBuilder.build(html);
        res.send(html);
    }

    * handlePost(ctx, errors, formdata) {
        const serviceAuth = yield services.authorise();
        if (serviceAuth.name === 'Error') {
            throw new Error(serviceAuth.message);
        }
        const userToken = yield security.getUserToken(ctx.redirect_url);

        set(ctx, 'serviceAuthorization', serviceAuth);
        set(ctx, 'token', userToken);
        const result = yield this.sendToOrchestrationService(ctx, errors, formdata, config.payment.applicationFee);
        set(formdata, 'ccdCase.id', result.ccdCase.id);
        set(formdata, 'ccdCase.state', result.ccdCase.state);
        set(formdata, 'registry.name', result.registry.name);
        return [ctx, errors];
    }

    * sendToOrchestrationService(ctx, errors, formdata, total) {
        set(formdata, 'payment.total', total);
        const result = yield services.sendToOrchestrationService(formdata, ctx);
        logger.info('sendToOrchestrationService result = ' + JSON.stringify(result));

        if (result.name === 'Error' || result === 'DUPLICATE_SUBMISSION') {
            const keyword = result === 'DUPLICATE_SUBMISSION' ? 'duplicate' : 'failure';
            errors.push(FieldError('submit', keyword, this.resourcePath, ctx));
        }

        logger.info({tags: 'Analytics'}, 'Application Case Created');

        return result;
    }

}

module.exports = Summary;
