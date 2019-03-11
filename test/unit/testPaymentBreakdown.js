// eslint-disable-line max-lines

'use strict';

const {expect} = require('chai');
const PaymentBreakdown = ('app/steps/ui/payment/breakdown/index');
const config = require('app/config');
const sinon = require('sinon');

describe('PaymentBreakdown', () => {

    describe('handlePost', () => {

        beforeEach(() => {
            nock(config.services.submit.url)
                .post('/submit')
                .reply(200, submitResponse);

            feesCalculator = sinon.stub(FeesCalculator.prototype, 'calc');

        });

        afterEach(() => {
            revertAuthorise();
            nock.cleanAll();
            feesCalculator.restore();
        });

        describe.skip('sendToOrchestrationService()', () => {
            it('should return to status 500 page when service authority fails', (done) => {
                const sessionData = minimalCaveatForm;
                const data = {};
                servicesMock.expects('authorise').returns(Promise.resolve({
                    name: 'Error',
                    message: 'Unable to find service'
                }));
                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        testWrapper.testStatus500Page(done, data);
                    });
            });
            it('should return to status 500 page when security idam calls fail', (done) => {
                const sessionData = minimalCaveatForm;
                const data = {};
                servicesMock.expects('authorise').returns(Promise.resolve('authorised'));
                securityMock.expects('getUserToken').returns(Promise.resolve({
                    name: 'Error',
                    message: 'Unable to find service'
                }));
                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        testWrapper.testStatus500Page(done, data);
                    });
            });
            it('should return to status 500 page when orchestration call fails', (done) => {
                const sessionData = minimalCaveatForm;
                const data = {};
                servicesMock.expects('authorise').returns(Promise.resolve('authorised'));
                securityMock.expects('getUserToken').returns(Promise.resolve('token'));
                servicesMock.expects('sendToOrchestrationService').returns(Promise.resolve({
                    name: 'Error',
                    message: 'Unable to find service'
                }));
                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        testWrapper.testStatus500Page(done, data);
                    });
            });
        });

    });
});
