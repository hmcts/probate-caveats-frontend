'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAddress = require('app/steps/ui/deceased/address/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('config');
const basePath = config.app.basePath;

describe('deceased-othernames', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForDeceasedAddress = basePath + DeceasedAddress.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedOtherNames');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedOtherNames');

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                applicant: {
                    firstName: 'value'
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const contentToExclude = ['otherName', 'removeName'];

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased has other names', (done) => {
            const sessionData = {
                applicant: {
                    firstName: 'value'
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe',
                    otherNames: {
                        name_0: {
                            firstName: 'James',
                            lastName: 'Miller'
                        },
                        name_1: {
                            firstName: 'Henry',
                            lastName: 'Hat'
                        }
                    }
                }
            };

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe'
                    };

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test otherNames schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);
        });

        it('test otherNames schema validation when invalid firstname is entered', (done) => {
            const data = {
                otherNames: {
                    name_0: {
                        firstName: '<John',
                        lastName: 'Doe'
                    }
                }
            };

            testWrapper.testErrors(done, data, 'invalid', ['firstName']);
        });

        it('test otherNames schema validation when invalid lastname is entered', (done) => {
            const data = {
                otherNames: {
                    name_0: {
                        firstName: 'John',
                        lastName: '<Doe'
                    }
                }
            };

            testWrapper.testErrors(done, data, 'invalid', ['lastName']);
        });

        it(`test it redirects to deceased address page: ${expectedNextUrlForDeceasedAddress}`, (done) => {
            const data = {
                otherNames: {
                    name_0: {
                        firstName: 'John',
                        lastName: 'Doe'
                    }
                }
            };

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
                });
        });
    });
});
