'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const Equality = steps.Equality;
const co = require('co');

describe('Equality', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Equality.constructor.getUrl();
            expect(url).to.equal('/equality-and-diversity');
            done();
        });
    });

    describe('runnerOptions', () => {
        describe('token feature disabled', () => {
            it('sets the options to redirect to PCQ when email is missing', (done) => {
                const ctx = {};
                const session = {
                    uuid: '6543210987654321',
                    form: {
                        applicationId: '1234567890123456',
                        equality: {
                            pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f'
                        }
                    },
                    language: 'en'
                };
                const host = 'http://localhost:3000';

                co(function* () {
                    const options = yield Equality.runnerOptions(ctx, session, host);

                    expect(options).to.deep.equal({
                        redirect: true,
                        url: 'http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=78e69022-2468-4370-a88e-bea2a80fa51f&partyId=1234567890123456&returnUrl=http://localhost:3000/summary&language=en'
                    });
                    done();
                }).catch(err => {
                    done(err);
                });
            });

            it('sets the options to redirect to PCQ when email is present', (done) => {
                const ctx = {};
                const session = {
                    uuid: '6543210987654321',
                    form: {
                        applicationId: '1234567890123456',
                        applicant: {
                            email: 'test@email.com'
                        },
                        equality: {
                            pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f'
                        }
                    },
                    language: 'en'
                };
                const host = 'http://localhost:3000';

                co(function* () {
                    const options = yield Equality.runnerOptions(ctx, session, host);

                    expect(options).to.deep.equal({
                        redirect: true,
                        url: 'http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=78e69022-2468-4370-a88e-bea2a80fa51f&partyId=test@email.com&returnUrl=http://localhost:3000/summary&language=en'
                    });
                    done();
                }).catch(err => {
                    done(err);
                });
            });
        });

        describe('token feature enabled', () => {
            it('sets the options to redirect to PCQ when email is missing', (done) => {
                const ctx = {};
                const session = {
                    uuid: '6543210987654321',
                    form: {
                        applicationId: '1234567890123456',
                        equality: {
                            pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f'
                        }
                    },
                    language: 'en',
                    featureToggles: {'ft_pcq_token': true}
                };
                const host = 'http://localhost:3000';

                co(function* () {
                    const options = yield Equality.runnerOptions(ctx, session, host);

                    const token = '83da26708b74d70ccf0439e8246e10f63f7c5eb9f200e0e7eea688175c14d1b7db4c20ca24f0e24f77ae9644' +
                        '30793d780416ceddd75ff7415c0eb6267c5f7dd133882e57031852b20046d35354a7aaf6c2057ec36d53fdeded8286b2cd' +
                        'fa38cfac957dd4dfd9adc07ef4284618261539149569aed7cc99ee433bc9aa176e38740cc16ba242fb25c6709920f9ab46' +
                        'a8bb368799b3a046eec9053234beba77e326babc7f3973b9f7004e855fbd7d68dd3634739f';

                    expect(options).to.deep.equal({
                        redirect: true,
                        url: `http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=78e69022-2468-4370-a88e-bea2a80fa51f&partyId=1234567890123456&returnUrl=http://localhost:3000/summary&language=en&token=${token}`
                    });
                    done();
                }).catch(err => {
                    done(err);
                });
            });

            it('sets the options to redirect to PCQ when email is present', (done) => {
                const ctx = {};
                const session = {
                    uuid: '6543210987654321',
                    form: {
                        applicationId: '1234567890123456',
                        applicant: {
                            email: 'test@email.com'
                        },
                        equality: {
                            pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f'
                        }
                    },
                    language: 'en',
                    featureToggles: {'ft_pcq_token': true}
                };
                const host = 'http://localhost:3000';

                co(function* () {
                    const options = yield Equality.runnerOptions(ctx, session, host);

                    const token = '83da26708b74d70ccf0439e8246e10f63f7c5eb9f200e0e7eea688175c14d1b7db4c20ca24f0e24f77ae96' +
                        '4430793d780416ceddd75ff7415c0eb6267c5f7dd133882e57031852b20046d35354a7aaf6c2057ec36d53fdeded8286' +
                        'b2cdfa38cfac957dd4df9cfa803e817b1c4176492645c930b9cdccc7a9452bcfb1307201245ac139f45eff6b9965da60' +
                        'f6a549a1b82d9cd0f4aa45eed646682aa6b668fb76efbc3f7a71bfec065c811ae27d37917127';

                    expect(options).to.deep.equal({
                        redirect: true,
                        url: `http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=78e69022-2468-4370-a88e-bea2a80fa51f&partyId=test@email.com&returnUrl=http://localhost:3000/summary&language=en&token=${token}`
                    });
                    done();
                }).catch(err => {
                    done(err);
                });
            });
        });
    });

    describe('isComplete()', () => {
        it('should return the completion status correctly if question already asked', (done) => {
            const ctx = {};
            const formdata = {
                equality: {
                    pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f'
                }
            };
            const complete = Equality.isComplete(ctx, formdata);
            expect(complete).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should return the completion status correctly if question not asked but payment completed', (done) => {
            const ctx = {};
            const formdata = {
                payment: {
                    status: 'Success'
                }
            };
            const complete = Equality.isComplete(ctx, formdata);
            expect(complete).to.deep.equal([true, 'inProgress']);
            done();
        });
    });
});
