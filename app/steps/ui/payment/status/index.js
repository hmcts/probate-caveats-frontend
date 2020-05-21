'use strict';

const Step = require('app/core/steps/Step');
const services = require('app/components/services');
const logger = require('app/components/logger');
const logInfo = (message, applicationId = 'Unknown') => logger(applicationId).info(message);
const logError = (message, applicationId = 'Unknown') => logger(applicationId).error(message);
const RedirectRunner = require('app/core/runners/RedirectRunner');
const {get, set} = require('lodash');
const Thankyou = require('app/steps/ui/thankyou');
const formatUrl = require('app/utils/FormatUrl');
const config = require('config');

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
        ctx.hostname = formatUrl.createHostname(req);
        ctx.serviceAuthToken = get(formdata, 'payment.serviceAuthToken');
        ctx.authToken = get(formdata, 'payment.authToken');
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.serviceAuthToken;
        delete ctx.authToken;
        delete ctx.userId;
        delete ctx.regId;
        delete ctx.sessionId;
        delete ctx.errors;
        delete ctx.paymentId;
        delete ctx.paymentDue;
        delete ctx.hostname;
        return [ctx, formdata];
    }

    * runnerOptions(ctx, session) {
        const formdata = session.form;
        const options = {};
        options.redirect = false;

        const data = {
            authToken: ctx.authToken,
            serviceAuthToken: ctx.serviceAuthToken,
            userId: ctx.userId,
            paymentId: ctx.paymentId
        };
        const findPaymentResponse = yield services.findPayment(data, formdata.applicationId);
        if (findPaymentResponse.name === 'Error') {
            logError(`Unable to find payment status for paymentId: ${ctx.paymentId}`, formdata.applicationId);
            return options;
        }
        logInfo(`Existing payment paymentId = ${ctx.paymentId} with response = ${findPaymentResponse.status}`, formdata.applicationId);
        const date = typeof findPaymentResponse.date_updated === 'undefined' ? ctx.paymentCreatedDate : findPaymentResponse.date_updated;
        this.updateFormDataPayment(formdata, findPaymentResponse, date);

        const updateCcdCaseErrors = yield this.updateCcdCasePaymentStatus(ctx, formdata);
        if (updateCcdCaseErrors) {
            return options;
        }

        options.redirect = true;
        if (findPaymentResponse.status !== 'Success') {
            options.url = config.app.basePath + this.steps.PaymentBreakdown.constructor.getUrl();
            logError('Payment Status was not Success, so returning to breakdown page', formdata.applicationId);
        } else {
            options.url = config.app.basePath + Thankyou.getUrl();
            logInfo('Payment Status was Success', formdata.applicationId);
        }

        return options;
    }

    * updateCcdCasePaymentStatus(ctx, formdata) {
        const submitData = {};
        Object.assign(submitData, formdata);
        const updateCasePaymentStatusResult = yield services.updateCcdCasePaymentStatus(submitData, ctx);

        if (updateCasePaymentStatusResult.name === 'Error') {
            logError(`updateCaseResult Error = ${updateCasePaymentStatusResult}`, formdata.applicationId);
            logError(`Update of case payment status failed for paymentId: ${ctx.paymentId}`, formdata.applicationId);
            return true;
        }
        set(formdata, 'ccdCase.state', updateCasePaymentStatusResult.ccdCase.state);
        logInfo({tags: 'Analytics Caveat case payment status updated'}, formdata.applicationId);
        logInfo(`Successfully updated Caveat case ${formdata.ccdCase.id} with payment status ${updateCasePaymentStatusResult.ccdCase.state}`, formdata.applicationId);

        return false;
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
