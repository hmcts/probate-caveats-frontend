'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');

class TestCommonContent {
    static runTest(page, beforeEach, afterEach) {
        xdescribe('Test the help content', () => {
            const testWrapper = new TestWrapper(page);

            xit('test help block content is loaded on page', (done) => {
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
                            helpTelephoneOpeningHoursTitle: commonContent.helpTelephoneOpeningHoursTitle,
                            helpTelephoneOpeningHours1: commonContent.helpTelephoneOpeningHours1,
                            helpTelephoneOpeningHours2: commonContent.helpTelephoneOpeningHours2,
                            helpTelephoneOpeningHours3: commonContent.helpTelephoneOpeningHours3,
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
