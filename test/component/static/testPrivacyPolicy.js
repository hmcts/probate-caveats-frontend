'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');

describe('privacy-policy', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('PrivacyPolicy');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const contentData = {
                mojPersonalInformationCharterLink: config.links.mojPersonalInformationCharter,
                termsLink: config.links.terms,
                cookiesLink: config.links.cookies,
                goodThingsFoundationLink: config.links.goodThingsFoundation,
                subjectAccessRequestLink: config.links.subjectAccessRequest,
                complaintsProcedureLink: config.links.complaintsProcedure,
                informationCommissionersOfficeLink: config.links.informationCommissionersOffice
            };

            testWrapper.testContent(done, contentData);
        });
    });
});
