import TestWrapper from '../../util/TestWrapper.mjs';
import commonContent from '../../../app/resources/en/translation/common.json' with {type: 'json'};

class TestCommonContent {
    static runTest(page, beforeEach, afterEach) {
        describe('Test the help content', async () => {
            const testWrapper = await TestWrapper.getInstance(page);

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
                            helpTelephoneOpeningHoursTitle: commonContent.helpTelephoneOpeningHoursTitle,
                            helpTelephoneOpeningHours1: commonContent.helpTelephoneOpeningHours1,
                            helpTelephoneOpeningHours2: commonContent.helpTelephoneOpeningHours2,
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

export default TestCommonContent;
