const {expect} = require('chai');
const sinon = require('sinon');
const lookupPaymentFees = require('app/middleware/lookupPaymentFees');
const FeesLookup = require('app/utils/FeesLookup');

describe('lookupPaymentFees', () => {
    let req, res, next;
    let feesLookupStub;

    beforeEach(() => {
        feesLookupStub = sinon.stub(FeesLookup.prototype, 'lookup');
        req = {
            session: {
                form: {
                    applicationId: 123
                }
            },
            authToken: '123',
            get: sinon.stub()
        };
        res = {
            sendStatus: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        feesLookupStub.restore();
    });

    it('should set fee total in formdata', (done) => {
        feesLookupStub.returns(Promise.resolve({
            status: 'success',
            total: '3'
        }));

        const expectedResponse = {
            status: 'success',
            total: '3'
        };

        lookupPaymentFees(req, res, next);

        setTimeout(() => {
            expect(req.session.form.fees.status).to.equal(expectedResponse.status);
            expect(req.session.form.fees.total).to.equal(expectedResponse.total);
            expect(req.session.form.payment.total).to.equal(expectedResponse.total);
            sinon.assert.callCount(next, 1);
            done();
        }, 10);
    });
});
