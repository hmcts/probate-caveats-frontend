'use strict';

const config = require('config');
const SERVICE_ID = config.payment.serviceId;
const SITE_ID = config.payment.siteId;
const APPLICATION_FEE_CODE = config.payment.applicationFeeCode;

const createPaymentData = (data, language) => {
    const commonContent = require(`app/resources/${language}/translation/common`);
    const version = config.payment.version;
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
            code: APPLICATION_FEE_CODE,
            memoLine: 'Probate Fees',
            reference: data.userId,
            version: version,
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
