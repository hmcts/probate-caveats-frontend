const path = require('path');
const chai = require('chai');
const {Pact} = require('@pact-foundation/pact');
// Alias flexible matchers for simplicity
const chaiAsPromised = require('chai-as-promised');
const config = require('config');
const expect = chai.expect;
const getPort = require('get-port');
const submitData = require('app/components/submit-data');
const utils = require('app/components/api-utils');
chai.use(chaiAsPromised);

describe('PACT SubmitDataClient', () => {

    let MOCK_SERVER_PORT;
    let provider;

    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        provider = new Pact({
            consumer: 'probate_caveatsFrontEnd',
            provider: 'probate_orchestrator_service_caveat_submit',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'caveatSubmission.log'),
            dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
            logLevel: 'INFO',
            spec: 2
        });
    });

    const ctx = {
        sessionID: 'someSessionId',
        authToken: 'authToken',
        userId: 'userId',
        reference: '654321ABC',
        session: {
            serviceAuthorization: 'someServiceAuthorization'
        }
    };

    const caveatBodyRequest = {
        applicationId: '1565395821345422',
        applicant: {
            firstName: 'appFirstName',
            lastName: 'appLastName',
            email: 'app@test.com',
            address: {
                addressLine1: '1 street',
                postCode: '123 ABC'
            }
        },
        deceased: {
            firstName: 'deceasedFirstName',
            lastName: 'deceasedLastName',
            address: {
                addressLine1: '1 street',
                postCode: '123 ABC'
            },
            'dod-date': '01/01/2022'
        },
        ccdCase: {
            id: '1535395401245028',
            state: 'CaseCreated'
        },
        registry: {
            name: 'registryName'
        },
        language: {
            bilingual: ''
        }
    };

    const body = submitData(ctx, caveatBodyRequest);

    const caveatBodyExpected = {
        applicationId: '1565395821345422',
        applicant: {
            firstName: 'appFirstName',
            lastName: 'appLastName',
            email: 'app@test.com',
            address: {
                addressLine1: '1 street',
                postCode: '123 ABC'
            }
        },
        deceased: {
            dod_date: '2022-01-01',
            firstName: 'deceasedFirstName',
            lastName: 'deceasedLastName',
            address: {
                addressLine1: '1 street',
                postCode: '123 ABC'
            }
        },
        ccdCase: {
            id: '1535395401245028',
            state: 'CaseCreated'
        },
        registry: {
            name: 'registryName'
        }
    };

    before(() =>
        provider.setup()
    );

    afterEach(() => provider.verify());

    describe('when caveat formdata is submitted', () => {
        describe('and is required to be submitted', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service submits caveat formdata with success',
                    uponReceiving: 'a submit request to POST caveat formdata',
                    withRequest: {
                        method: 'POST',
                        path: '/forms/1565395821345422/submissions',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        },
                        body: body
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: caveatBodyExpected
                    }
                })
            );

            it('successfully submitted caveat form data', (done) => {
                const headers = {
                    'Content-Type': 'application/json',
                    'Session-Id': ctx.sessionID,
                    'Authorization': ctx.authToken,
                    'ServiceAuthorization': ctx.serviceAuthToken
                };
                const fetchOptions = utils.fetchOptions(body, 'POST', headers);
                const verificationPromise = utils.fetchJson(`http://localhost:${MOCK_SERVER_PORT}/forms/${caveatBodyRequest.applicationId}/submissions`, fetchOptions);
                expect(verificationPromise).to.eventually.eql(caveatBodyExpected).notify(done);
            });
        });
    });

    after(() => {
        return provider.finalize();
    });
});
