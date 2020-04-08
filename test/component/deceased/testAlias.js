'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedOtherNames = require('app/steps/ui/deceased/othernames/index');
const DeceasedAddress = require('app/steps/ui/deceased/address/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('config');
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
        testCommonContent.runTest('DeceasedAlias');

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
            const contentToExclude = ['theDeceased'];

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData, contentToExclude);

                });
        });

        it('test alias schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to deceased other names page: ${expectedNextUrlForDeceasedOtherNames}`, (done) => {
            const data = {
                alias: 'optionYes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedOtherNames);
        });

        it(`test it redirects to deceased address page: ${expectedNextUrlForDeceasedAddress}`, (done) => {
            const data = {
                alias: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
        });

    });
});
