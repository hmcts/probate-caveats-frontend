'use strict';

const Step = require('app/core/steps/Step');
const FieldError = require('app/components/error');
const config = require('app/config');
const {get, set} = require('lodash');
const logger = require('app/components/logger')('Init');
const services = require('app/components/services');
const security = require('app/components/security');

class PaymentBreakdown extends Step {
    static getUrl() {
        return '/payment-breakdown';
    }

    generateFields(ctx, errors) {
        const fields = super.generateFields(ctx, errors);
        set(fields, 'applicationFee.value', config.payment.applicationFee);
        return fields;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedLastName = get(formdata.deceased, 'lastName', '');
        ctx.paymentError = get(req, 'query.status');
        ctx.total = config.payment.applicationFee;
        ctx.applicationFee = config.payment.applicationFee;
        return ctx;
    }

    * handlePost(ctx, errors, formdata, session, hostname) {
        [ctx, formdata, errors] = yield this.setCtxWithSecurityTokens(ctx, formdata, errors);
        if (errors.length > 0) {
            return ctx, errors;
        }

        if (!formdata.ccdCase || !formdata.ccdCase.id) {
            const [result, submissionErrors] = yield this.sendToOrchestrationService(ctx, errors, formdata, ctx.total);
            errors = errors.concat(submissionErrors);
            if (errors.length > 0) {
                logger.error('Failed to create case in CCD.');
                return [ctx, errors];
            }
            set(formdata, 'ccdCase.id', result.ccdCase.id);
            set(formdata, 'ccdCase.state', result.ccdCase.state);
        }

        if (formdata.paymentPending !== 'unknown') {
            const canCreatePayment = yield this.canCreatePayment(ctx, formdata);
            logger.info('can create payment: ' + canCreatePayment);
            if (canCreatePayment) {
                formdata.paymentPending = 'true';

                if (formdata.creatingPayment !== 'true') {
                    formdata.creatingPayment = 'true';
                    const ccdCaseId = get(formdata.ccdCase, 'id');
                    const data = {
                        amount: parseFloat(ctx.total),
                        authToken: ctx.authToken,
                        serviceAuthToken: ctx.serviceAuthToken,
                        userId: ctx.userId,
                        applicationFee: ctx.applicationFee,
                        copies: ctx.copies,
                        deceasedLastName: ctx.deceasedLastName,
                        ccdCaseId: ccdCaseId
                    };

                    const response = yield services.createPayment(data, hostname);
                    logger.info(`Payment creation in breakdown with response = ${JSON.stringify(response)}`);

                    if (response.name === 'Error') {
                        errors.push(FieldError('payment', 'failure', this.resourcePath, ctx));
                        formdata.creatingPayment = 'false';
                        return [ctx, errors];
                    }

                    formdata.creatingPayment = 'false';
                    set(ctx, 'paymentId', response.reference);
                    set(ctx, 'paymentCreatedDate', response.date_created);
                    set(ctx, 'status', response.status);

                   // session.save();

                    this.nextStepUrl = () => response._links.next_url.href;
                } else {
                    logger.warn('Skipping - create payment request in progress');
                }

            } else {
                formdata.paymentPending = ctx.total === 0 ? 'false' : 'true';
                delete this.nextStepUrl;
            }
        } else {
            logger.warn('Skipping create payment as authorisation is unknown.');
        }

        return [ctx, errors];
    }

    isComplete(ctx, formdata) {
        return [['true', 'false'].includes(formdata.paymentPending), 'inProgress'];
    }

    * setCtxWithSecurityTokens(ctx, formdata, errors) {
        const serviceAuthResult = yield services.authorise();
        if (serviceAuthResult.name === 'Error') {
            logger.info(`serviceAuthResult Error = ${serviceAuthResult}`);
            const keyword = 'failure';
            formdata.creatingPayment = null;
            formdata.paymentPending = null;
            errors.push(FieldError('authorisation', keyword, this.resourcePath, ctx));
            return [ctx, formdata, errors];
        }
        const userToken = yield security.getUserToken();
        set(ctx, 'serviceAuthToken', serviceAuthResult);
        set(ctx, 'authToken', userToken);
        return [ctx, formdata, errors];
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

        return [result, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.paymentError;
        delete ctx.deceasedLastName;
        delete ctx.applicationFee;
        delete ctx.serviceAuthToken;
        delete ctx.authToken;
        return [ctx, formdata];
    }

    * canCreatePayment(ctx, formdata) {
        const paymentId = get(formdata.payment, 'paymentId');
        if (paymentId) {
            const data = {
                authToken: ctx.authToken,
                serviceAuthToken: ctx.serviceAuthToken,
                userId: ctx.userId,
                paymentId: paymentId
            };
            const paymentResponse = yield services.findPayment(data);
            logger.info(`Payment retrieval in breakdown for paymentId = ${paymentId} with response = ${JSON.stringify(paymentResponse)}`);
            if (typeof paymentResponse === 'undefined') {
                return true;
            }
            return (paymentResponse.status !== 'Initiated') && (paymentResponse.status !== 'Success');
        }
        return true;
    }

}

module.exports = PaymentBreakdown;
