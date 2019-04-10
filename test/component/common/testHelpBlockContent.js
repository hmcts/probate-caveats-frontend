'use strict';

const TestWrapper = require('test/util/TestWrapper');
const common = require('app/resources/en/translation/common');

class TestHelpBlockContent {
    static runTest(page) {
        describe('Test the help content', () => {

            const testWrapper = new TestWrapper(page);

            it('test help block content is loaded on page', (done) => {
                const sessionData = {applicant: 'value'};
                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        testWrapper.agent.get(testWrapper.pageUrl)
                            .then(() => {
                                const playbackData = {
                                    helpTitle: common.helpTitle,
                                    helpText: common.helpText,
                                    contactTelLabel: common.contactTelLabel,
                                    helpEmailLabel: common.helpEmailLabel
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
