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
        ctx.total = config.payment.applicationFee;
        ctx.applicationFee = config.payment.applicationFee;
        return ctx;
    }

    handleGet(ctx) {
        return [ctx, ctx.errors];
    }

    * handlePost(ctx, errors, formdata, session, hostname) {
        set(formdata, 'payment.total', ctx.total);

        // Setup security tokens
        yield this.setCtxWithSecurityTokens(ctx, errors);
        if (errors.length > 0) {
            return [ctx, errors];
        }

        // If we dont already have a case so create one
        if (!formdata.ccdCase || !formdata.ccdCase.id) {
            const result= yield this.sendToOrchestrationService(ctx, formdata, errors);
            if (errors.length > 0) {
                logger.error('Failed to create case in CCD.');
                return [ctx, errors];
            }
            set(formdata, 'ccdCase.id', result.ccdCase.id);
            set(formdata, 'ccdCase.state', result.ccdCase.state);
        }

        // get latest payment status if payment already exists
        let paymentResponse;
        const paymentId = get(formdata.payment, 'paymentId');
        if (paymentId) {
            const data = {
                authToken: ctx.authToken,
                serviceAuthToken: ctx.serviceAuthToken,
                userId: ctx.userId,
                paymentId: paymentId
            };
            paymentResponse = yield services.findPayment(data);
            logger.info(`Existing Payment in breakdown with response = ${JSON.stringify(paymentResponse)}`);
            if (paymentResponse.name === 'Error') {
                errors.push(FieldError('payment', 'failure', this.resourcePath, ctx));
                return [ctx, errors];
            }
        }

        // If payment doesn't exist or existing payment has to be recreated
        if (!paymentId || paymentResponse.status !== 'Success') {
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

            paymentResponse = yield services.createPayment(data, hostname);
            logger.info(`New Payment in breakdown with response = ${JSON.stringify(paymentResponse)}`);

            if (paymentResponse.name === 'Error') {
                errors.push(FieldError('payment', 'failure', this.resourcePath, ctx));
                return [ctx, errors];
            }
        }

        //Ensure that payment details on form are updated to the latest values
        set(ctx, 'paymentId', paymentResponse.reference);
        set(ctx, 'paymentCreatedDate', paymentResponse.date_created);
        set(ctx, 'status', paymentResponse.status);

        // Decide to send to Gov.pay or simply forward to /payment-status
        if (paymentResponse.status !== 'Success' && this.paymentContainsNextUrl(paymentResponse)) {
            this.nextStepUrl = () => paymentResponse._links.next_url.href;
        } else {
            // this is required since this page is re-entrant for failues on /payment-status
            this.nextStepUrl = () => this.next(ctx).constructor.getUrl();
        }

        logger.info('nextStepUrl is: ' + this.nextStepUrl(ctx));
        return [ctx, errors];
    }

    // indicates that payment needs to be sent to Gov.Pay
    paymentContainsNextUrl(paymentResponse) {
        if (paymentResponse._links.next_url) {
            return true;
        }
        return false;
    }

    isComplete(ctx, formdata) {
        return [['true', 'false'].includes(formdata.paymentPending), 'inProgress'];
    }

    * setCtxWithSecurityTokens(ctx, errors) {
        const serviceAuthResult = yield services.authorise();
        if (serviceAuthResult.name === 'Error') {
            logger.info(`serviceAuthResult = ${serviceAuthResult}`);
            errors.push(FieldError('authorisation', 'failure', this.resourcePath, ctx));
            return;
        }
        const userToken = yield security.getUserToken();
        if (userToken.name === 'Error') {
            logger.info(`userToken = ${userToken}`);
            errors.push(FieldError('authorisation', 'failure', this.resourcePath, ctx));
            return;
        }
        set(ctx, 'serviceAuthToken', serviceAuthResult);
        set(ctx, 'authToken', userToken);

    }

    * sendToOrchestrationService(ctx, formdata, errors) {
        const result = yield services.sendToOrchestrationService(formdata, ctx);
        logger.info('sendToOrchestrationService result = ' + JSON.stringify(result));
        if (result.name === 'Error') {
            errors.push(FieldError('submit', 'failure', this.resourcePath, ctx));
            return;
        }

        logger.info({tags: 'Analytics'}, 'Application Case Created');
        return result;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedLastName;
        delete ctx.applicationFee;
        delete ctx.serviceAuthToken;
        delete ctx.authToken;
        delete ctx.total;
        return [ctx, formdata];
    }

}

module.exports = PaymentBreakdown;
