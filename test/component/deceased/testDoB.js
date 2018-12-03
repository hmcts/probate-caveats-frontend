'use strict';

const TestWrapper = require('test/util/TestWrapper');
// const DeceasedDomicile = require('app/steps/ui/deceased/domicile/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('deceased-dob', () => {
    let testWrapper;
    // const expectedNextUrlForDeceasedDomicile = DeceasedDomicile.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDob');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedDob');

        it('test right content loaded on the page', (done) => {
            testWrapper.testContent(done, []);
        });

        it('test errors message displayed for missing data', (done) => {

            const errorsToTest = ['dob_day', 'dob_month', 'dob_year'];
            const data = {};

            testWrapper.testErrors(done, data, 'required', errorsToTest);

        });

        it('test errors message displayed for invalid date', (done) => {

            const errorsToTest = ['dob_date'];
            const data = {dob_day: '31', dob_month: '9', dob_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);

        });

        it('test errors message displayed for non-numeric field', (done) => {

            const errorsToTest = ['dob_day'];
            const data = {dob_day: 'ab', dob_month: '09', dob_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);

        });

        it('test errors message displayed for three digits in year field', (done) => {

            const errorsToTest = ['dob_year'];
            const data = {dob_day: '12', dob_month: '9', dob_year: '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);

        });

        // it(`test it redirects to deceased domiciled: ${expectedNextUrlForDeceasedDomicile}`, (done) => {
        //     const data = {dob_day: '01', dob_month: '01', dob_year: '1945'};
        //     testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDomicile);
        // });
    });
});
