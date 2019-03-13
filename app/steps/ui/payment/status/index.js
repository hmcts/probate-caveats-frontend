'use strict';

const Step = require('app/core/steps/Step');
const services = require('app/components/services');
const security = require('app/components/security');
const FieldError = require('app/components/error');
const logger = require('app/components/logger')('Init');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const {get, set} = require('lodash');
const config = require('app/config');

class PaymentStatus extends Step {

    runner() {
        return new RedirectRunner();
    }

    static getUrl() {
        return '/payment-status';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.paymentId = get(formdata, 'payment.paymentId');
        ctx.userId = req.userId;
        ctx.paymentDue = get(ctx, 'payment.total') > 0;
        ctx.regId = req.session.regId;
        ctx.sessionId = req.session.id;
        ctx.errors = req.errors;
        ctx.telephone = config.serviceline.number;
        ctx.email = config.serviceline.email;
        ctx.hours = config.serviceline.hours;
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.authToken;
        delete ctx.userId;
        delete ctx.regId;
        delete ctx.sessionId;
        delete ctx.errors;
        delete ctx.paymentId;
        delete ctx.paymentDue;
        delete ctx.telephone;
        delete ctx.email;
        delete ctx.hours;
        return [ctx, formdata];
    }

    isComplete(ctx, formdata) {
        return [typeof formdata.payment !== 'undefined' && formdata.ccdCase.state === 'CaveatRaised' && (formdata.payment.status === 'Success' || formdata.payment.status === 'not_required'), 'inProgress'];
    }

    * runnerOptions(ctx, formdata) {
        const options = {};

        // Setup security tokens
        const securityErrors = yield this.setCtxWithSecurityTokens(ctx);
        if (securityErrors.length > 0) {
            options.redirect = true;
            options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
            return options;
        }

        const data = {
            authToken: ctx.authToken,
            serviceAuthToken: ctx.serviceAuthToken,
            userId: ctx.userId,
            paymentId: ctx.paymentId
        };

        const findPaymentResponse = yield services.findPayment(data);
        logger.info('Payment retrieval in status for paymentId = ' + ctx.paymentId + ' with response = ' + JSON.stringify(findPaymentResponse));
        if (findPaymentResponse.name === 'Error') {
            options.redirect = true;
            options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
            return options;
        }

        const date = typeof findPaymentResponse.date_updated === 'undefined' ? ctx.paymentCreatedDate : findPaymentResponse.date_updated;
        this.updateFormDataPayment(formdata, findPaymentResponse, date);

        const updateCcdCaseErrors = yield this.updateCcdCasePaymentStatus(ctx, formdata);
        if (updateCcdCaseErrors.length > 0) {
            logger.error('Update of case payment status failed for paymentId = ' + ctx.paymentId);
            options.redirect = true;
            options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
            return options;
        }

        if (findPaymentResponse.status !== 'Success') {
            options.redirect = true;
            options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}?status=failure`;
            logger.error('Status was not Success.');
            return options;
        }

        options.redirect = false;

        return options;
    }

    * setCtxWithSecurityTokens(ctx) {
        const serviceAuthResult = yield services.authorise();
        const errors = [];
        if (serviceAuthResult.name === 'Error') {
            logger.info(`serviceAuthResult Error = ${serviceAuthResult}`);
            errors.push(FieldError('authorisation', 'failure', this.resourcePath, ctx));
            return errors;
        }
        const userToken = yield security.getUserToken();
        set(ctx, 'serviceAuthToken', serviceAuthResult);
        set(ctx, 'authToken', userToken);
        return errors;
    }

    * updateCcdCasePaymentStatus(ctx, formdata) {
        const submitData = {};
        Object.assign(submitData, formdata);
        const errors = [];
        const updateCasePaymentStatusResult = yield services.updateCcdCasePaymentStatus(submitData, ctx);
        if (updateCasePaymentStatusResult.name === 'Error') {
            logger.error(`updateCaseResult Error = ${updateCasePaymentStatusResult}`);
            errors.push(FieldError('update', 'failure', this.resourcePath, ctx));
        } else {
            set(formdata, 'ccdCase.state', updateCasePaymentStatusResult.ccdCase.state);
            logger.info({tags: 'Analytics'}, 'Payment status update');
            logger.info('Successfully updated payment status to caseState ' + updateCasePaymentStatusResult.ccdCase.state);
        }

        return errors;
    }

    handleGet(ctx) {
        return [ctx, ctx.errors];
    }

    updateFormDataPayment(formdata, findPaymentResponse, date) {
        Object.assign(formdata.payment, {
            channel: findPaymentResponse.channel,
            transactionId: findPaymentResponse.external_reference,
            reference: findPaymentResponse.reference,
            date: date,
            amount: findPaymentResponse.amount,
            status: findPaymentResponse.status,
            siteId: findPaymentResponse.site_id
        });
    }
}

module.exports = PaymentStatus;
