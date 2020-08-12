'use strict';

const paymentData = require('app/components/payment-data');
const {assert, expect} = require('chai');

describe('payment-data.js', () => {
    describe('createPaymentData()', () => {
        it('should return no fees when there is no application fee', (done) => {
            const data = {
                amount: 0,
                description: 'Ffioedd Profiant',
                ccdCaseId: '123',
                applicationFee: 0
            };
            const result = paymentData.createPaymentData(data, 'cy');
            expect(result).to.deep.equal({
                amount: 0,
                description: 'Ffioedd Profiant',
                ccd_case_number: '123',
                service: 'PROBATE',
                currency: 'GBP',
                site_id: 'P223',
                fees: [],
                language: 'CY'
            });
            done();
        });

        it('should return the application fee when applicationFee > 0', (done) => {
            const data = {
                amount: 215,
                description: 'Ffioedd Profiant',
                ccdCaseId: '123',
                applicationFee: 215,
                code: 'FEE0288',
                version: 3,
                userId: '11111'
            };
            const result = paymentData.createPaymentData(data, 'cy');
            expect(result).to.deep.equal({
                amount: 215,
                description: 'Ffioedd Profiant',
                ccd_case_number: '123',
                service: 'PROBATE',
                currency: 'GBP',
                site_id: 'P223',
                fees: [{
                    calculated_amount: 215,
                    ccd_case_number: '123',
                    code: 'FEE0288',
                    memo_line: 'Probate Fees',
                    reference: '11111',
                    version: 3,
                    volume: 1
                }],
                language: 'CY'
            });
            done();
        });

        it('should return all fees when there is an application fee but an empty language flag when english selected', (done) => {
            const data = {
                amount: 219.50,
                description: 'Probate Fees',
                ccdCaseId: '123',
                applicationFee: 215,
                code: 'FEE0288',
                version: 3,
                userId: '11111'
            };
            const result = paymentData.createPaymentData(data, 'en');
            expect(result).to.deep.equal({
                amount: 219.50,
                description: 'Probate Fees',
                ccd_case_number: '123',
                service: 'PROBATE',
                currency: 'GBP',
                site_id: 'P223',
                fees: [{
                    calculated_amount: 215,
                    ccd_case_number: '123',
                    code: 'FEE0288',
                    memo_line: 'Probate Fees',
                    reference: '11111',
                    version: 3,
                    volume: 1
                }],
                language: ''
            });
            done();
        });
    });

    describe('createPaymentFees()', () => {
        it('should return the correct data', () => {
            const params = {
                amount: 4.50,
                ccdCaseId: 'CASEREF123',
                code: 'CODE123',
                memoLine: 'Some memo line',
                reference: 123,
                version: 3,
                volume: 3
            };
            const paymentFees = paymentData.createPaymentFees(params);
            assert.deepEqual(paymentFees, {
                calculated_amount: params.amount,
                ccd_case_number: params.ccdCaseId,
                code: params.code,
                memo_line: params.memoLine,
                reference: params.reference,
                version: params.version,
                volume: params.volume
            });
        });
    });
});
