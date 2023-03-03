/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact, Matchers} = require('@pact-foundation/pact');
// Alias flexible matchers for simplicity
const {somethingLike} = Matchers;
const chaiAsPromised = require('chai-as-promised');
const config = require('config');
const services = require('app/components/services');
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Pact PaymentClient', () => {

    const MOCK_SERVER_PORT = 8383;
    const provider = new Pact({
        consumer: 'probate_caveatsFrontEnd',
        provider: 'payment_cardPayment',
        port: MOCK_SERVER_PORT,
        log: path.resolve(process.cwd(), 'logs', 'pactPayment.log'),
        dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
        logLevel: 'INFO',
        spec: 2
    });
    const ctx = {
        sessionID: 'someSessionId',
        authToken: 'Bearer UserAuthToken',
        userId: 'userId',
        reference: '654321ABC',
        session: {
            serviceAuthorization: 'ServiceToken'
        }
    };

    const paymentBodyExpectation = {
        ccd_case_number: somethingLike('1234567891011123'),
        amount: somethingLike(3.00),
        fees: somethingLike([{
            calculated_amount: 3.00,
            volume: 1,
            code: 'FEE0002',
            version: 1
        }]),
        method: somethingLike('card'),
        service_name: 'Probate',
        channel: 'online',
        description: 'Application for the entry or extension of a caveat',
        external_provider: ('gov pay'),
        reference: somethingLike('RC-1519-9028-2432-0001'),
        external_reference: somethingLike('06kd1v30vm45hqvggphdjqbeqa'),
        site_id: somethingLike('P223'),
        payment_group_reference: somethingLike('2019-15470733181'),
        currency: 'GBP'
    };

    /*
    const createPaymentData = {
        amount: 3,
        authToken: ctx.authToken,
        serviceAuthToken: ctx.session.serviceAuthorization,
        userId: ctx.userId,
        applicationFee: 3,
        code: 'FEE0288',
        version: 1,
        deceasedLastName: 'deceasedLastName',
        ccdCaseId: '1234567891011123',
        applicationversion: 1,
        applicationcode: 'FEE0026',
    };
    const postPaymentData = {
        amount: 3,
        description: 'Probate Fees',
        ccd_case_number: '1234567891011123',
        service: 'PROBATE',
        currency: 'GBP',
        site_id: 'P223',
        fees: [{
            calculated_amount: 3,
            ccd_case_number: '1234567891011123',
            code: 'FEE0288',
            memo_line: 'Probate Fees',
            reference: 'userId',
            version: 1,
            volume: 1
        }],
        language: ''
    };
    const paymentPostedExpectation = {
        reference: somethingLike('RC-1519-9028-2432-0001'),
        external_reference: somethingLike('e2kkddts5215h9qqoeuth5c0v'),
        status: somethingLike('submitted'),
        date_created: somethingLike('2020-12-11T15:40:40.079+0000')
    };*/
    before(() =>
        provider.setup()
    );

    // After each individual test (one or more interactions)
    // we validate that the correct request came through.
    // This ensures what we _expect_ from the provider, is actually
    // what we've asked for (and is what gets captured in the contract)
    afterEach(() => provider.verify());

    describe('when a request to get an initiated payment', () => {
        describe('is required from a GET', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'A payment reference exists',
                    uponReceiving: 'a request for information for that payment reference',
                    withRequest: {
                        method: 'GET',
                        path: '/card-payments/' + ctx.reference,
                        headers: {
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.session.serviceAuthorization
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json; charset=UTF-8'},
                        body: paymentBodyExpectation
                    }
                })
            );

            it('successfully returns initiated payment', (done) => {
                const data = {
                    applicationId: 'applicationID',
                    authToken: ctx.authToken,
                    serviceAuthToken: ctx.session.serviceAuthorization,
                    paymentId: ctx.reference
                };
                const verificationPromise = services.findPayment(data, 'localhost');
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    /*    describe('when a request to create a payment', () => {
        describe('is POSTED', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'A Payment is posted for a case',
                    uponReceiving: ' a request to create a payment for a case',
                    withRequest: {
                        method: 'POST',
                        path: '/card-payments',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization,
                            'return-url': 'http://localhost:3000/payment-status',
                            'service-callback-url': 'http://localhost:8888/payment-updates'
                        },
                        body: postPaymentData
                    },
                    willRespondWith: {
                        status: 201,
                        headers: {'Content-Type': 'application/json'},
                        body: paymentPostedExpectation
                    }
                })
            );

            it('successfully returns created payment', (done) => {
                const verificationPromise = services.createPayment(createPaymentData, 'http://localhost:3000', 'en');
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });*/

    // Write pact files
    after(() => {
        return provider.finalize();
    });

});
