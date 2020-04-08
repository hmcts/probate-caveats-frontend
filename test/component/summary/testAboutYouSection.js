'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const applicantData = require('test/data/applicant');
const languageContent = require('../../../app/resources/en/translation/language');
const applicantContent = requireDir(module, '../../../app/resources/en/translation/applicant');
const config = require('config');
const basePath = config.app.basePath;

describe('summary-about-you-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = applicantData;
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the summary page about you section, when no data is entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }

                    const playbackData = {
                        bilingual: languageContent.question,
                        firstName: applicantContent.name.firstName,
                        lastName: applicantContent.name.lastName,
                        emailAddress: applicantContent.email.question,
                        applicantAddress: applicantContent.address.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the summary page about you section, when section is complete', (done) => {
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }

                    const playbackData = {
                        bilingual: languageContent.question,
                        firstName: applicantContent.name.firstName,
                        lastName: applicantContent.name.lastName,
                        emailAddress: applicantContent.email.question,
                        applicantAddress: applicantContent.address.question
                    };

                    Object.assign(playbackData, applicantData.applicant);
                    playbackData.address = applicantData.applicant.address.formattedAddress;
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
    });
});
