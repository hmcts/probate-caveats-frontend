'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');

class TestCommonContent {
    static runTest(page, beforeEach, afterEach) {
        describe('Test the help content', () => {
            const testWrapper = new TestWrapper(page);

            it('test help block content is loaded on page', (done) => {
                if (typeof beforeEach === 'function') {
                    beforeEach();
                }

                const sessionData = {
                    applicant: {
                        firstName: 'FirstName'
                    }
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .then(() => {
                        const playbackData = {
                            helpTitle: commonContent.helpTitle,
                            helpHeading1: commonContent.helpHeading1,
                            helpHeading2: commonContent.helpHeading2,
                            helpHeading3: commonContent.helpHeading3,
                            helpTelephoneNumber: commonContent.helpTelephoneNumber,
                            helpTelephoneOpeningHours: commonContent.helpTelephoneOpeningHours,
                            helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, commonContent.helpEmail)
                        };

                        testWrapper.testDataPlayback(done, playbackData);
                    })
                    .catch(err => {
                        done(err);
                    });
            });

            testWrapper.destroy();
            if (typeof afterEach === 'function') {
                afterEach();
            }
        });
    }
}

module.exports = TestCommonContent;
