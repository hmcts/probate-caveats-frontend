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
                    const token = '79d3c3968c1b94baa8753a66c72a3382aacb1152f20fac4ba2ad7c754adf464a538a77496a281db63b2c' +
                        'aaa49380fcb5f4210a0fc3933a0c4d5f2f790c026df47946c7b8640dc476f47a12822df5c3852a8f925ec2fa8cb56b362e' +
                        '35b8befd90168a5f037b55b70dd45e2656606f032686c23647af33d59c6d1a2a5c39f81a927372f1555c7ff6001aa6c4bf' +
                        '5af175d04d71a9bc12fabbf589cf3fec5e7aa23f1a1dec411ba2d23e4276811e78c009058f22a66759a29fc279e73f0d59' +
                        '42e2e9';

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
                    const token = '79d3c3968c1b94baa8753a66c72a3382aacb1152f20fac4ba2ad7c754adf464a538a77496a281db63b2caa' +
                        'a49380fcb5f4210a0fc3933a0c4d5f2f790c026df47946c7b8640dc476f47a12822df5c3852a8f925ec2fa8cb56b362e' +
                        '35b8befd902c4bd6ca2e809947803d74ed09a872607c208418ae6b2558bb8b2261888f94e1bd545ea21e3482582f584e' +
                        'ae9eae7380c05c782641e52c20f85c5034e0b2ef73f7abf843bdb93aececf6aa5092dae7a93cc881da9cf3c45eec9cf7' +
                        'cb5490ca66';

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
