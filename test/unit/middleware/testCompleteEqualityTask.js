import EqualityStub from '../../service-stubs/equalityAndDiversityHealth.js';
import completeEqualityTask from '../../../app/middleware/completeEqualityTask.js';
import config from 'config';
import {expect} from 'chai';
import sinon from 'sinon';

describe('completeEqualityTask', () => {
    describe('PCQ feature toggle is ON and health is UP', () => {
        let equalityStub;
        before(() => {
            equalityStub = EqualityStub();
            equalityStub.start();
        });

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

        after(() => equalityStub.stop());
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
