'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const lockPaymentAttempt = require('app/middleware/lockPaymentAttempt');

describe('lockPaymentAttempt', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            session: {
                form: {
                    applicationId: 123
                },
                save: sinon.stub()
            },
            log: {
                info: sinon.stub()
            },
        };
        res = {
            sendStatus: sinon.stub()
        };
        next = sinon.stub();
    });

    it('should allow first lock attempt on applicationId to succeed', (done) => {
        lockPaymentAttempt(req, res, next);
        expect(req.log.info.firstCall.args[0]).to.equal('Locking payment: 123');
        expect(req.session.paymentLock).to.equal('Locked');
        sinon.assert.callCount(req.session.save, 1);
        sinon.assert.callCount(next, 1);
        done();
    });

    it('should redirect on subsequent lock attempts on applicationId', (done) => {
        req.session.paymentLock = 'Locked';
        lockPaymentAttempt(req, res, next);
        expect(req.log.info.firstCall.args[0]).to.equal('Ignoring 2nd locking attempt for: 123');
        sinon.assert.callCount(req.session.save, 0);
        expect(req.session.paymentLock).to.equal('Locked');
        sinon.assert.callCount(res.sendStatus, 1);
        done();
    });
});
