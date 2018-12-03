'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ThankYou = steps.ThankYou;

describe('ThankYou', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ThankYou.constructor.getUrl();
            expect(url).to.equal('/thankyou');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with an empty CCD Case Id when not present', (done) => {
            req = {
                session: {
                    form: {}
                }
            };

            ctx = ThankYou.getContextData(req);
            expect(ctx.ccdReferenceNumber).to.deep.equal('');
            done();
        });

        it('should return the context with the CCD Case ID when present (WITH dashes)', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: '1234-5678-9012-3456'
                        }
                    }
                }
            };

            ctx = ThankYou.getContextData(req);
            expect(ctx.ccdReferenceNumber).to.deep.equal('1234-5678-9012-3456');
            done();
        });

        it('should return the context with the CCD Case ID when present (WITHOUT dashes)', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: '1234567890123456'
                        }
                    }
                }
            };

            ctx = ThankYou.getContextData(req);
            expect(ctx.ccdReferenceNumber).to.deep.equal('1234-5678-9012-3456');
            done();
        });

        it('should return the context with the CCD Case ID when present as an integer (WITHOUT dashes)', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456
                        }
                    }
                }
            };

            ctx = ThankYou.getContextData(req);
            expect(ctx.ccdReferenceNumber).to.deep.equal('1234-5678-9012-3456');
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                ccdReferenceNumber: '1234-1235-1236-1237'
            };
            [ctx, formdata] = ThankYou.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });
});
