'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedOtherNames = require('app/steps/ui/deceased/othernames/index');
const DeceasedAddress = require('app/steps/ui/deceased/address/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const basePath = config.app.basePath;

describe('deceased-alias', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedOtherNames = basePath + DeceasedOtherNames.getUrl();
    const expectedNextUrlForDeceasedAddress = basePath + DeceasedAddress.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAlias');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedAlias');

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                applicant: 'value',
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const excludeContent = ['theDeceased'];

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {

                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, excludeContent, contentData);

                });
        });

        it('test alias schema validation when no data is entered', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to deceased other names page: ${expectedNextUrlForDeceasedOtherNames}`, (done) => {
            const data = {
                alias: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedOtherNames);
        });

        it(`test it redirects to deceased address page: ${expectedNextUrlForDeceasedAddress}`, (done) => {
            const data = {
                alias: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
        });

    });
});
