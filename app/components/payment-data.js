'use strict';

const config = require('config');
const SERVICE_ID = config.payment.serviceId;
const SITE_ID = config.payment.siteId;

const createPaymentData = (data, language) => {
    const commonContent = require(`app/resources/${language}/translation/common`);
    const currency = config.payment.currency;
    const paymentData = {
        amount: data.amount,
        description: commonContent.paymentProbateFees,
        ccd_case_number: data.ccdCaseId,
        service: SERVICE_ID,
        currency: currency,
        site_id: SITE_ID,
        fees: [],
        language: (language === 'en' ? '' : language.toUpperCase())
    };

    if (data.applicationFee > 0) {
        paymentData.fees.push(createPaymentFees({
            amount: data.applicationFee,
            ccdCaseId: data.ccdCaseId,
            code: data.code,
            memoLine: 'Probate Fees',
            reference: data.userId,
            version: data.version,
            volume: 1
        }));
    }

    return paymentData;
};

const createPaymentFees = (params) => {
    return {
        calculated_amount: params.amount,
        ccd_case_number: params.ccdCaseId,
        code: params.code,
        memo_line: params.memoLine,
        reference: params.reference,
        version: params.version,
        volume: params.volume
    };
};

module.exports = {
    createPaymentData: createPaymentData,
    createPaymentFees: createPaymentFees
};
