'use strict';

const Step = require('app/core/steps/Step');
const FieldError = require('app/components/error');
const config = require('app/config');
const {get, set} = require('lodash');
const logger = require('app/components/logger')('Init');
const services = require('app/components/services');
const security = require('app/components/security');
const formatUrl = require('app/utils/FormatUrl');

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
        ctx.hostname = formatUrl.createHostname(req);
        return ctx;
    }

    handleGet(ctx) {
        return [ctx, ctx.errors];
    }

    * handlePost(ctx, errors, formdata, session, hostname) {
        // this is required since this page is re-entrant for failues on /payment-status
        this.nextStepUrl = () => this.next(ctx).constructor.getUrl();

        set(formdata, 'payment.total', ctx.total);

        try {
            // Setup security tokens
            yield this.setCtxWithSecurityTokens(ctx, errors);
            if (errors.length > 0) {
                return [ctx, errors];
            }

            // If we dont already have a case so create one
            if (!formdata.ccdCase || !formdata.ccdCase.id) {
                const result = yield this.sendToOrchestrationService(ctx, formdata, errors);
                if (errors.length > 0) {
                    logger.error('Failed to create case in CCD.');
                    return [ctx, errors];
                }
                set(formdata, 'ccdCase.id', result.ccdCase.id);
                set(formdata, 'ccdCase.state', result.ccdCase.state);
            }

            // create payment
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
            const paymentResponse = yield services.createPayment(data, hostname);
            logger.info(`New Payment in breakdown with response = ${JSON.stringify(paymentResponse)}`);
            if (paymentResponse.name === 'Error') {
                errors.push(FieldError('payment', 'failure', this.resourcePath, ctx));
                return [ctx, errors];
            }

            //Ensure that payment details on form are updated to the latest values
            set(ctx, 'paymentId', paymentResponse.reference);
            set(ctx, 'paymentCreatedDate', paymentResponse.date_created);
            set(ctx, 'status', paymentResponse.status);

            // Forward toGov.pay
            this.nextStepUrl = () => paymentResponse._links.next_url.href;

            logger.info('nextStepUrl is: ' + this.nextStepUrl(ctx));
            return [ctx, errors];
        } finally {
            this.unlockPayment(session);
        }
    }

    unlockPayment(session) {
        const applicationId = session.form.applicationId;
        logger.info('Unlocking applicationId: ' + applicationId);
        session.paymentLock = 'Unlocked';
        session.save();
    }

    * setCtxWithSecurityTokens(ctx, errors) {
        const serviceAuthResult = yield services.authorise();
        if (serviceAuthResult.name === 'Error') {
            logger.info(`serviceAuthResult = ${serviceAuthResult}`);
            errors.push(FieldError('authorisation', 'failure', this.resourcePath, ctx));
            return;
        }
        const userToken = yield security.getUserToken(ctx.hostname);
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
        delete ctx.total;
        delete ctx.hostname;
        return [ctx, formdata];
    }

}

module.exports = PaymentBreakdown;
