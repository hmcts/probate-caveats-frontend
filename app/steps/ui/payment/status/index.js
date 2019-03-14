'use strict';

const Step = require('app/core/steps/Step');
const services = require('app/components/services');
const security = require('app/components/security');
const logger = require('app/components/logger')('Init');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const {get, set} = require('lodash');
const config = require('app/config');
const Thankyou = require('app/steps/ui/thankyou');

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

    * runnerOptions(ctx, formdata) {
        const options = {};
        options.redirect = false;

        // Setup security tokens
        const securityErrors = yield this.setCtxWithSecurityTokens(ctx);
        if (securityErrors) {
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
            logger.error('Unable to find payment status for paymentId: ' + ctx.paymentId);
            return options;
        }

        const date = typeof findPaymentResponse.date_updated === 'undefined' ? ctx.paymentCreatedDate : findPaymentResponse.date_updated;
        this.updateFormDataPayment(formdata, findPaymentResponse, date);

        const updateCcdCaseErrors = yield this.updateCcdCasePaymentStatus(ctx, formdata);
        if (updateCcdCaseErrors) {
            return options;
        }

        options.redirect = true;
        if (findPaymentResponse.status !== 'Success') {
            options.url = `${this.steps.PaymentBreakdown.constructor.getUrl()}`;
            logger.error('Payment Status was not Success, so returning to breakdown page.');
        } else {
            options.url = Thankyou.getUrl();
            logger.info('Payment Status was Success');
        }

        return options;
    }

    * setCtxWithSecurityTokens(ctx) {
        const serviceAuthResult = yield services.authorise();
        if (serviceAuthResult.name === 'Error') {
            logger.info(`serviceAuthResult Error = ${serviceAuthResult}`);
            return true;
        }
        const userToken = yield security.getUserToken();
        if (userToken.name === 'Error') {
            logger.info(`userToken Error = ${userToken}`);
            return true;
        }
        set(ctx, 'serviceAuthToken', serviceAuthResult);
        set(ctx, 'authToken', userToken);
        return false;
    }

    * updateCcdCasePaymentStatus(ctx, formdata) {
        const submitData = {};
        Object.assign(submitData, formdata);
        const updateCasePaymentStatusResult = yield services.updateCcdCasePaymentStatus(submitData, ctx);

        if (updateCasePaymentStatusResult.name === 'Error') {
            logger.error(`updateCaseResult Error = ${updateCasePaymentStatusResult}`);
            logger.error('Update of case payment status failed for paymentId = ' + ctx.paymentId);
            return true;
        }
        set(formdata, 'ccdCase.state', updateCasePaymentStatusResult.ccdCase.state);
        logger.info({tags: 'Analytics'}, 'Payment status update');
        logger.info('Successfully updated payment status to caseState ' + updateCasePaymentStatusResult.ccdCase.state);

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
