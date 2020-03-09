'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDobKnown = require('app/steps/ui/deceased/dobknown/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('config');
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
        testCommonContent.runTest('DeceasedDod');

        it('test right content loaded on the page', (done) => {
            const sessionData = {applicant: {firstName: 'value'}};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test error message displayed for missing data', (done) => {
            const errorsToTest = ['dod-day', 'dod-month', 'dod-year'];

            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it('test error message displayed for invalid day', (done) => {
            const errorsToTest = ['dod-day'];
            const data = {'dod-day': '32', 'dod-month': '09', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid month', (done) => {
            const errorsToTest = ['dod-month'];
            const data = {'dod-day': '13', 'dod-month': '14', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric day', (done) => {
            const errorsToTest = ['dod-day'];
            const data = {'dod-day': 'ab', 'dod-month': '09', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric month', (done) => {
            const errorsToTest = ['dod-month'];
            const data = {'dod-day': '13', 'dod-month': 'ab', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric year', (done) => {
            const errorsToTest = ['dod-year'];
            const data = {'dod-day': '13', 'dod-month': '12', 'dod-year': '20ab'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for three digits in year field', (done) => {
            const errorsToTest = ['dod-year'];
            const data = {'dod-day': '12', 'dod-month': '9', 'dod-year': '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for date in the future', (done) => {
            const errorsToTest = ['dod-date'];
            const data = {
                'dod-day': '12',
                'dod-month': '9',
                'dod-year': '3000'
            };

            testWrapper.testErrors(done, data, 'dateInFuture', errorsToTest);
        });

        it('test error message displayed for DoD before DoB', (done) => {
            const errorsToTest = ['dod-date'];
            const sessionData = {
                deceased: {
                    'dob-day': '12',
                    'dob-month': '9',
                    'dob-year': '2002'
                }
            };
            const data = {
                'dod-day': '01',
                'dod-month': '01',
                'dod-year': '2000'
            };

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, data, 'dodBeforeDob', errorsToTest);
                });
        });

        it(`test it redirects to deceased dob known: ${expectedNextUrlForDeceasedDobKnown}`, (done) => {
            const data = {
                'dod-day': '01',
                'dod-month': '01',
                'dod-year': '2000'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDobKnown);
        });
    });
});
