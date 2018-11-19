'use strict';

const config = require('app/config');
const SERVICE_ID = config.payment.serviceId;
const SITE_ID = config.payment.siteId;
const APPLICATION_FEE_CODE = config.payment.applicationFeeCode;
const ADDITIONAL_COPY_FEE_CODE_UK = config.payment.copies.uk.code;
const ADDITIONAL_COPY_FEE_CODE_OVERSEAS = config.payment.copies.overseas.code;

const createPaymentData = (data) => {
    const version = config.payment.version;
    const versionCopiesOverseas = config.payment.copies.overseas.version;
    const versionCopiesUk = config.payment.copies.uk.version;
    const currency = config.payment.currency;
    const paymentData = {
        amount: data.amount,
        description: 'Probate Fees',
        ccd_case_number: data.ccdCaseId,
        service: SERVICE_ID,
        currency: currency,
        site_id: SITE_ID,
        fees: []
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

    if (data.copies.uk.number > 0) {
        paymentData.fees.push(createPaymentFees({
            amount: data.copies.uk.cost,
            ccdCaseId: data.ccdCaseId,
            code: ADDITIONAL_COPY_FEE_CODE_UK,
            memoLine: 'Additional UK copies',
            reference: data.userId,
            version: versionCopiesUk,
            volume: data.copies.uk.number
        }));
    }

    if (data.copies.overseas.number > 0) {
        paymentData.fees.push(createPaymentFees({
            amount: data.copies.overseas.cost,
            ccdCaseId: data.ccdCaseId,
            code: ADDITIONAL_COPY_FEE_CODE_OVERSEAS,
            memoLine: 'Additional overseas copies',
            reference: data.userId,
            version: versionCopiesOverseas,
            volume: data.copies.overseas.number
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
