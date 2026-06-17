import TestWrapper from '../../util/TestWrapper.mjs';
import commonContent from '../../../app/resources/en/translation/common.json' with {type: 'json'};
import config from 'config';

describe('contact-us', () => {
    let testWrapper;

    beforeEach(async() => {
        testWrapper = await TestWrapper.getInstance('ContactUs');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            const contentData = {
                helpLineNumber: commonContent.helpTelephoneNumber,
                helpLineHours: commonContent.helpTelephoneOpeningHours,
                callChargesLink: config.links.callCharges
            };

            testWrapper.testContent(done, contentData);
        });
    });
});
