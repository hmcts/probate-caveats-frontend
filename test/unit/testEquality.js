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
                    // url: 'http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=78e69022-2468-4370-a88e-bea2a80fa51f&partyId=1234567890123456&returnUrl=http://localhost:3000/summary&language=en'
                    url: 'http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=APPLICANT&partyId=1234567890123456&returnUrl=http://localhost:3000/summary&language=en'
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
                    // url: 'http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=78e69022-2468-4370-a88e-bea2a80fa51f&partyId=test@email.com&returnUrl=http://localhost:3000/summary&language=en'
                    url: 'http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=APPLICANT&partyId=test@email.com&returnUrl=http://localhost:3000/summary&language=en'
                });
                done();
            }).catch(err => {
                done(err);
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
