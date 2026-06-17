import TestWrapper from '../../util/TestWrapper.mjs';
import commonContent from '../../../app/resources/en/translation/common.json' with {type: 'json'};
import config from 'config';

describe('terms-conditions', () => {
    let testWrapper;

    beforeEach(async () => {
        testWrapper = await TestWrapper.getInstance('TermsConditions');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const contentData = {
                privacyLink: config.links.privacy,
                cookiesLink: config.links.cookies,
                helpLineNumber: commonContent.helpTelephoneNumber,
                helpLineHours: commonContent.helpTelephoneOpeningHours,
                callChargesLink: config.links.callCharges
            };

            testWrapper.testContent(done, contentData);
        });
        it('test right HM content loaded on the page', (done) => {
            testWrapper.testContentPresent(done, ['This service is managed by His Majesty&rsquo;s Courts and Tribunals service.']);
        });
    });
});
