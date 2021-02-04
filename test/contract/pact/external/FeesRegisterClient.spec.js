/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {somethingLike, like} = Matchers;
const chaiAsPromised = require('chai-as-promised');
const FeesLookup = require('app/utils/FeesLookup');
const config = require('config');
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Pact FeesRegisterClient', () => {
    const MOCK_SERVER_PORT = 4411;
    const provider = new Pact({
        consumer: 'probate_caveatsFrontEnd',
        provider: 'feeRegister_lookUp',
        port: MOCK_SERVER_PORT,
        log: path.resolve(process.cwd(), 'logs', 'pactFeesRegister.log'),
        dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
        logLevel: 'INFO',
        spec: 2
    });
    const ctx = {
        sessionID: 'someSessionId',
        authToken: 'authToken',
        session: {
            serviceAuthorization: 'someServiceAuthorization'
        }
    };

    const session = {
        featureToggles: {'ft_newfee_register_code': true}
    };
    const feeResponseBodyExpectation = {
        fee_amount: like(99.00),
        code: somethingLike('FEE0288'),
        version: like(1),
    };
    // Setup a Mock Server before unit tests run.
    // This server acts as a Test Double for the real Provider API.
    // We then call addInteraction() for each test to configure the Mock Service
    // to act like the Provider
    // It also sets up expectations for what requests are to come, and will fail
    // if the calls are not seen.
    before(() =>
        provider.setup()
    );

    // After each individual test (one or more interactions)
    // we validate that the correct request came through.
    // This ensures what we _expect_ from the provider, is actually
    // what we've asked for (and is what gets captured in the contract)
    afterEach(() => provider.verify());

    describe('when a request for a Caveats Fee', () => {
        describe('is required from a GET', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'service is registered in Fee registry',
                    uponReceiving: 'a request to GET a fee',
                    withRequest: {
                        method: 'GET',
                        path: '/fees-register/fees/lookup',
                        query: 'applicant_type=all&channel=default&event=miscellaneous&jurisdiction1=family&jurisdiction2=probate+registry&keyword=Caveat&service=probate',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: feeResponseBodyExpectation
                    }
                })
            );

            it('successfully returns fee', (done) => {
                const feeLookupClient = new FeesLookup('2199ddf2-3def-11eb-b378-0242ac130002', session);
                const verificationPromise = feeLookupClient.lookup(ctx.authToken);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    // Write pact files
    after(() => {
        return provider.finalize();
    });

});
