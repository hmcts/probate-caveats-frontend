'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');

class TestHelpBlockContent {
    static runTest(page) {
        describe('Test the help content', () => {
            const testWrapper = new TestWrapper(page);

            it('test help block content is loaded on page', (done) => {
                const sessionData = {
                    applicant: {
                        firstName: 'FirstName'
                    }
                };
                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        testWrapper.agent.get(testWrapper.pageUrl)
                            .then(() => {
                                const playbackData = {
                                    helpTitle: commonContent.helpTitle,
                                    helpHeadingTelephone: commonContent.helpHeadingTelephone,
                                    helpHeadingEmail: commonContent.helpHeadingEmail,
                                    helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, config.links.contactEmailAddress)
                                };

                                testWrapper.testDataPlayback(done, playbackData);
                            })
                            .catch(err => {
                                done(err);
                            });
                    });
            });

            testWrapper.destroy();
        });
    }
}

module.exports = TestHelpBlockContent;
