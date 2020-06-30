'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const completeEqualityTask = rewire('app/middleware/completeEqualityTask');
const config = require('config');

let equalityStub;
const startStub = () => {
    equalityStub = require('test/service-stubs/equalityAndDiversityHealth');
};
const stopStub = () => {
    equalityStub.close();
    delete require.cache[require.resolve('test/service-stubs/equalityAndDiversityHealth')];
};
describe('completeEqualityTask', () => {
    describe('PCQ feature toggle is ON and health is UP', () => {
        before(() => startStub());

        it('should redirect to PCQ', (done) => {
            const params = {
                isEnabled: true,
                req: {
                    session: {
                        form: {}
                    }
                },
                res: {
                    locals: {launchDarkly: {}},
                    redirect: () => {
                        // Do nothing
                    }
                },
                next: sinon.spy()
            };

            completeEqualityTask(params);

            setTimeout(() => {
                expect(params.req.session.form.equality.pcqId).to.not.equal('Service down');
                expect(params.next.calledOnce).to.equal(true);

                done();
            }, 500);
        });

        after(() => stopStub());
    });

    describe('PCQ feature toggle is ON and health is DOWN', () => {
        it('should continue the journey to /summary', (done) => {
            const params = {
                isEnabled: true,
                req: {
                    session: {
                        form: {}
                    }
                },
                res: {
                    redirect: () => {
                        // Do nothing
                    }
                },
                next: sinon.spy()
            };
            const redirectSpy = sinon.spy(params.res, 'redirect');

            completeEqualityTask(params);

            setTimeout(() => {
                expect(redirectSpy.calledOnce).to.equal(true);
                expect(redirectSpy.calledWith(`${config.app.basePath}/summary`)).to.equal(true);
                redirectSpy.restore();
                done();
            }, 500);
        });
    });

    describe('PCQ feature toggle is OFF', () => {
        it('should continue the journey to /summary', (done) => {
            const params = {
                isEnabled: false,
                req: {
                    session: {
                        form: {}
                    }
                },
                res: {
                    redirect: sinon.spy()
                },
                next: sinon.spy()
            };

            completeEqualityTask(params);

            setTimeout(() => {
                sinon.assert.calledOnce(params.res.redirect);
                expect(params.res.redirect.calledOnce).to.equal(true);
                expect(params.res.redirect.calledWith('/summary')).to.equal(true);

                done();
            }, 500);
        });
    });
});
