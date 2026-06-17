import DeceasedDoD from '../../../app/steps/ui/deceased/dod/index.js';
import TestWrapper from '../../util/TestWrapper.js';
import config from 'config';
import testCommonContent from '../common/testCommonContent.mjs';

const basePath = config.app.basePath;

describe('deceased-name', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDoD = basePath + DeceasedDoD.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedName');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedName');

        it('test right content loaded on the page', (done) => {
            const sessionData = {applicant: {firstName: 'value'}};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);

        });

        it('test errors message displayed for invalid firstName', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: '<dee',
                lastName: 'ceased'
            };

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid lastName', (done) => {
            const errorsToTest = ['lastName'];
            const data = {
                firstName: 'dee',
                lastName: '<ceased'
            };

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeceasedDoD}`, (done) => {
            const data = {
                firstName: 'Bob',
                lastName: 'Smith'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDoD);
        });

    });
});
