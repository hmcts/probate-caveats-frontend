'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const FeatureToggle = require('app/utils/FeatureToggle');
const RewiredFeatureToggle = rewire('app/utils/FeatureToggle');

describe('FeatureToggle', () => {
    describe('checkToggle()', () => {
        it('should call the callback function when the api returns successfully', (done) => {
            const params = {
                req: {
                    session: {
                        form: {}
                    }
                },
                res: {},
                next: () => true,
                redirectPage: '/dummy-page',
                launchDarkly: {
                    ftValue: {'ft_caveats_shutter': true}
                },
                featureToggleKey: 'ft_caveats_shutter',
                callback: sinon.spy()
            };
            const featureToggle = new FeatureToggle();

            featureToggle.checkToggle(params);
            featureToggle.checkToggle(params); // Checking a second call the ld doesn't hang

            setTimeout(() => {
                expect(params.callback.calledTwice).to.equal(true);
                expect(params.callback.calledWith({
                    req: params.req,
                    res: params.res,
                    next: params.next,
                    redirectPage: params.redirectPage,
                    isEnabled: true,
                    featureToggleKey: params.featureToggleKey
                })).to.equal(true);

                done();
            }, 1000);
        });

        it('should call next() when the api returns an error', (done) => {
            class FeatureToggleStub {
                getInstance() {
                    return true;
                }
                variation() {
                    throw new Error('Test error');
                }
            }
            const params = {
                req: {
                    session: {
                        form: {}
                    }
                },
                res: {},
                next: sinon.spy(),
                redirectPage: '/dummy-page',
                launchDarkly: {},
                featureToggleKey: 'ft_fees_api',
                callback: () => true
            };
            RewiredFeatureToggle.__set__('LaunchDarkly', FeatureToggleStub);
            const featureToggle = new RewiredFeatureToggle();

            featureToggle.checkToggle(params);

            expect(params.next.calledOnce).to.equal(true);

            done();
        });
    });

    describe('togglePage()', () => {
        it('should call next() when isEnabled is set to true', (done) => {
            const params = {
                isEnabled: true,
                res: {},
                next: sinon.spy()
            };
            const featureToggle = new FeatureToggle();

            featureToggle.togglePage(params);

            expect(params.next.calledOnce).to.equal(true);
            expect(params.next.calledWith()).to.equal(true);
            done();
        });

        it('should redirect to the specified page when isEnabled is set to false', (done) => {
            const params = {
                isEnabled: false,
                res: {redirect: sinon.spy()},
                next: {},
                redirectPage: '/applicant-phone'
            };
            const featureToggle = new FeatureToggle();

            featureToggle.togglePage(params);

            expect(params.res.redirect.calledOnce).to.equal(true);
            expect(params.res.redirect.calledWith('/applicant-phone')).to.equal(true);
            done();
        });
    });

    describe('toggleExistingPage()', () => {
        it('should call next() when isEnabled is set to false', (done) => {
            const params = {
                isEnabled: false,
                res: {},
                next: sinon.spy()
            };
            const featureToggle = new FeatureToggle();

            featureToggle.toggleExistingPage(params);

            expect(params.next.calledOnce).to.equal(true);
            expect(params.next.calledWith()).to.equal(true);
            done();
        });

        it('should redirect to the specified page when isEnabled is set to true', (done) => {
            const params = {
                isEnabled: true,
                res: {redirect: sinon.spy()},
                next: {},
                redirectPage: '/applicant-phone'
            };
            const featureToggle = new FeatureToggle();

            featureToggle.toggleExistingPage(params);

            expect(params.res.redirect.calledOnce).to.equal(true);
            expect(params.res.redirect.calledWith('/applicant-phone')).to.equal(true);
            done();
        });
    });

    describe('toggleFeature()', () => {
        describe('should set the feature toggle', () => {
            it('when the session contains a featureToggles object and call next()', (done) => {
                const params = {
                    req: {session: {featureToggles: {}}},
                    featureToggleKey: 'document_upload',
                    isEnabled: true,
                    next: sinon.spy()
                };
                const featureToggle = new FeatureToggle();

                featureToggle.toggleFeature(params);

                expect(params.req.session.featureToggles).to.deep.equal({document_upload: true});
                expect(params.next.calledOnce).to.equal(true);
                expect(params.next.calledWith()).to.equal(true);
                done();
            });

            it('when the session does not contain a featureToggles object and call next()', (done) => {
                const params = {
                    req: {session: {}},
                    featureToggleKey: 'document_upload',
                    isEnabled: true,
                    next: sinon.spy()
                };
                const featureToggle = new FeatureToggle();

                featureToggle.toggleFeature(params);

                expect(params.req.session.featureToggles).to.deep.equal({document_upload: true});
                expect(params.next.calledOnce).to.equal(true);
                expect(params.next.calledWith()).to.equal(true);
                done();
            });
        });
    });

    describe('appwideToggles()', () => {
        it('should return ctx when no appwide toggles are present', (done) => {
            const appwideToggles = [];
            const req = {
                session: {
                    featureToggles: {}
                }
            };
            let ctx = {};

            ctx = FeatureToggle.appwideToggles(req, ctx, appwideToggles);

            expect(ctx).to.deep.equal({});
            done();
        });

        it('should add all appwide toggles to ctx when present', (done) => {
            const appwideToggles = ['testToggle'];
            const req = {
                session: {
                    featureToggles: {
                        testToggle: false
                    }
                }
            };
            let ctx = {};

            ctx = FeatureToggle.appwideToggles(req, ctx, appwideToggles);

            expect(ctx).to.deep.equal({
                featureToggles: {
                    testToggle: 'false'
                }
            });
            done();
        });
    });

    describe('isEnabled()', () => {
        describe('should return true', () => {
            it('if the feature toggle exists and is true', (done) => {
                const featureToggles = {document_upload: true};
                const key = 'document_upload';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(true);
                done();
            });
        });

        describe('should return false', () => {
            it('if the feature toggle exists and is false', (done) => {
                const featureToggles = {document_upload: false};
                const key = 'document_upload';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });

            it('if the feature toggle does not exist', (done) => {
                const featureToggles = {};
                const key = 'document_upload';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });

            it('if there are no feature toggles', (done) => {
                const featureToggles = '';
                const key = 'document_upload';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });

            it('if the key is not specified', (done) => {
                const featureToggles = {document_upload: false};
                const key = '';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });
        });
    });
});
