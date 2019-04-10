'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDobKnown = require('app/steps/ui/deceased/dobknown/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const basePath = config.app.basePath;
const nock = require('nock');

describe('deceased-dod', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDobKnown = basePath + DeceasedDobKnown.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDod');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedDod');

        it('test right content loaded on the page', (done) => {
            const sessionData = {applicant: 'value'};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test error message displayed for missing data', (done) => {
            const errorsToTest = ['dod_day', 'dod_month', 'dod_year'];
            const data = {};

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test error message displayed for invalid day', (done) => {
            const errorsToTest = ['dod_day'];
            const data = {dod_day: '32', dod_month: '09', dod_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid month', (done) => {
            const errorsToTest = ['dod_month'];
            const data = {dod_day: '13', dod_month: '14', dod_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric day', (done) => {
            const errorsToTest = ['dod_day'];
            const data = {dod_day: 'ab', dod_month: '09', dod_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric month', (done) => {
            const errorsToTest = ['dod_month'];
            const data = {dod_day: '13', dod_month: 'ab', dod_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric year', (done) => {
            const errorsToTest = ['dod_year'];
            const data = {dod_day: '13', dod_month: '12', dod_year: '20ab'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for three digits in year field', (done) => {
            const errorsToTest = ['dod_year'];
            const data = {dod_day: '12', dod_month: '9', dod_year: '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for date in the future', (done) => {
            const errorsToTest = ['dod_date'];
            const data = {
                dod_day: '12',
                dod_month: '9',
                dod_year: '3000'
            };

            testWrapper.testErrors(done, data, 'dateInFuture', errorsToTest);
        });

        it('test error message displayed for DoD before DoB', (done) => {
            const errorsToTest = ['dod_date'];
            const sessionData = {
                deceased: {
                    dob_day: '12',
                    dob_month: '9',
                    dob_year: '2002'
                }
            };
            const data = {
                dod_day: '01',
                dod_month: '01',
                dod_year: '2000'
            };

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, data, 'dodBeforeDob', errorsToTest);
                });
        });

        it(`test it redirects to deceased dob known: ${expectedNextUrlForDeceasedDobKnown}`, (done) => {
            const data = {
                dod_day: '01',
                dod_month: '01',
                dod_year: '2000'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDobKnown);
        });

    });
});
