'use strict';

const Step = require('app/core/steps/Step');
const FieldError = require('app/components/error');
const {get, set} = require('lodash');
const logger = require('app/components/logger');
const logInfo = (message, applicationId = 'Unknown') => logger(applicationId).info(message);
const services = require('app/components/services');
const security = require('app/components/security');
const formatUrl = require('app/utils/FormatUrl');
const FeesLookup = require('app/utils/FeesLookup');

class PaymentBreakdown extends Step {
    static getUrl() {
        return '/payment-breakdown';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;

        ctx.deceasedLastName = get(formdata.deceased, 'lastName', '');
        ctx.hostname = formatUrl.createHostname(req);
        ctx.applicationId = get(formdata, 'applicationId');
        ctx.authToken = req.authToken;
        return ctx;
    }

    handleGet(ctx, formdata) {
        const fees = formdata.fees;
        this.checkFeesStatus(fees);

        ctx.applicationFee = parseFloat(fees.total).toFixed(2);
        ctx.total = parseFloat(fees.total).toFixed(2);
        return [ctx, ctx.errors];
    }

    checkFeesStatus(fees) {
        if (fees.status !== 'success') {
            throw new Error('Unable to calculate fees from Fees Api');
        }
    }

    * handlePost(ctx, errors, formdata, session, hostname) {
        // this is required since this page is re-entrant for failues on /payment-status
        this.nextStepUrl = () => this.next(ctx).constructor.getUrl();

        try {
            const feesLookup = new FeesLookup(formdata.applicationId, session, hostname);
            const confirmFees = yield feesLookup.lookup(ctx.authToken);
            this.checkFeesStatus(confirmFees);
            const originalFees = formdata.fees;
            if (confirmFees.total !== originalFees.total) {
                throw new Error(`Error calculated fees totals have changed from ${originalFees.total} to ${confirmFees.total}`);
            }
            ctx.total = originalFees.total;
            ctx.applicationFee = originalFees.total;
            ctx.applicationversion = confirmFees.applicationversion;
            ctx.applicationcode = confirmFees.applicationcode;

            // Setup security tokens
            yield this.setCtxWithSecurityTokens(ctx, errors, session.language);
            if (errors.length > 0) {
                return [ctx, errors];
            }

            // If we dont already have a case so create one
            if (!formdata.ccdCase || !formdata.ccdCase.id) {
                const result = yield this.sendToOrchestrationService(ctx, formdata, errors, session.language);
                if (errors.length > 0) {
                    return [ctx, errors];
                }
                set(formdata, 'ccdCase.id', result.ccdCase.id);
                set(formdata, 'ccdCase.state', result.ccdCase.state);
            }

            // create payment
            const ccdCaseId = get(formdata.ccdCase, 'id');
            const data = {
                amount: ctx.total,
                authToken: ctx.authToken,
                serviceAuthToken: ctx.serviceAuthToken,
                userId: ctx.userId,
                applicationFee: ctx.applicationFee,
                copies: ctx.copies,
                deceasedLastName: ctx.deceasedLastName,
                ccdCaseId: ccdCaseId,
                applicationId: ctx.applicationId,
                version: ctx.applicationversion,
                code: ctx.applicationcode
            };
            const paymentResponse = yield services.createPayment(data, hostname, session.language);
            logInfo(`New Payment reference: ${paymentResponse.reference}`, formdata.applicationId);
            if (paymentResponse.name === 'Error') {
                errors.push(FieldError('payment', 'failure', this.resourcePath, ctx, session.language));
                return [ctx, errors];
            }

            //Ensure that payment details on form are updated to the latest values
            set(ctx, 'paymentId', paymentResponse.reference);
            set(ctx, 'paymentCreatedDate', paymentResponse.date_created);
            set(ctx, 'status', paymentResponse.status);

            // Forward toGov.pay
            this.nextStepUrl = () => paymentResponse._links.next_url.href;

            logInfo('nextStepUrl is: ' + this.nextStepUrl(ctx), formdata.applicationId);
            return [ctx, errors];
        } finally {
            this.unlockPayment(session);
        }
    }

    unlockPayment(session) {
        const applicationId = session.form.applicationId;
        logInfo('Unlocking applicationId', applicationId);
        session.paymentLock = 'Unlocked';
        session.save();
    }

    * setCtxWithSecurityTokens(ctx, errors, language) {
        const serviceAuthResult = yield services.authorise(ctx.applicationId);
        if (serviceAuthResult.name === 'Error') {
            logInfo('failed to obtain serviceAuthToken', ctx.applicationId);
            errors.push(FieldError('authorisation', 'failure', this.resourcePath, ctx, language));
            return;
        }
        const authToken = yield security.getUserToken(ctx.applicationId);
        if (authToken.name === 'Error') {
            logInfo('failed to obtain authToken', ctx.applicationId);
            errors.push(FieldError('authorisation', 'failure', this.resourcePath, ctx, language));
            return;
        }
        set(ctx, 'serviceAuthToken', serviceAuthResult);
        set(ctx, 'authToken', authToken);
    }

    * sendToOrchestrationService(ctx, formdata, errors, language) {
        const result = yield services.sendToOrchestrationService(formdata, ctx);
        if (result.name === 'Error') {
            logInfo('Failed to create case', formdata.applicationId);
            errors.push(FieldError('submit', 'failure', this.resourcePath, ctx, language));
            return;
        }
        logInfo(`Case created: ${result.ccdCase.id}`, formdata.applicationId);
        logInfo({tags: 'Analytics Application Case Created'}, formdata.applicationId);
        return result;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedLastName;
        delete ctx.applicationFee;
        delete ctx.total;
        delete ctx.hostname;
        delete ctx.applicationId;
        return [ctx, formdata];
    }

}

module.exports = PaymentBreakdown;
