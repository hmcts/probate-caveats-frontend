'use strict';

const TestWrapper = require('test/util/TestWrapper');
const {set} = require('lodash');
const DeceasedAddress = require('app/steps/ui/deceased/address/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const basePath = config.app.basePath;

describe('deceased-othernames', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForDeceasedAddress = basePath + DeceasedAddress.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedOtherNames');
        sessionData = {};
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedOtherNames');

        it('test right content loaded on the page', (done) => {
            set(sessionData, 'applicant', 'value');
            set(sessionData, 'deceased.firstName', 'John');
            set(sessionData, 'deceased.lastName', 'Doe');

            const excludeKeys = ['otherName', 'removeName'];

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test right content loaded on the page when deceased has other names', (done) => {
            set(sessionData, 'applicant', 'value');
            set(sessionData, 'deceased.firstName', 'John');
            set(sessionData, 'deceased.lastName', 'Doe');
            set(sessionData, 'deceased.otherNames.name_0.firstName', 'James');
            set(sessionData, 'deceased.otherNames.name_0.lastName', 'Miller');
            set(sessionData, 'deceased.otherNames.name_1.firstName', 'Henry');
            set(sessionData, 'deceased.otherNames.name_1.lastName', 'Hat');

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe'
                    };

                    testWrapper.testContent(done, [], contentData);
                });
        });

        it('test otherNames schema validation when no data is entered', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it('test otherNames schema validation when invalid firstname is entered', (done) => {
            const data = {};
            set(data, 'otherNames.name_0.firstName', '<John');
            set(data, 'otherNames.name_0.lastName', 'Doe');

            testWrapper.testErrors(done, data, 'invalid', ['firstName']);
        });

        it('test otherNames schema validation when invalid lastname is entered', (done) => {
            const data = {};
            set(data, 'otherNames.name_0.firstName', 'John');
            set(data, 'otherNames.name_0.lastName', '<Doe');

            testWrapper.testErrors(done, data, 'invalid', ['lastName']);
        });

        it(`test it redirects to deceased address page: ${expectedNextUrlForDeceasedAddress}`, (done) => {
            const data = {};
            set(data, 'otherNames.name_0.firstName', 'John');
            set(data, 'otherNames.name_0.lastName', 'Doe');

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
                });
        });
    });
});
