'use strict';

const TestWrapper = require('test/util/TestWrapper');
const common = require('app/resources/en/translation/common');
const config = require('app/config');

class TestHelpBlockContent {
    static runTest(page) {
        describe('Test the help content', () => {
            const testWrapper = new TestWrapper(page);

            it('test help block content is loaded on page', (done) => {
                testWrapper.agent.get(testWrapper.pageUrl)
                    .then(() => {
                        const playbackData = {};
                        playbackData.helpTitle = common.helpTitle;
                        playbackData.helpText = common.helpText;
                        playbackData.contactTelLabel = common.contactTelLabel;
                        playbackData.helpEmailLabel = common.helpEmailLabel;

                        testWrapper.testDataPlayback(done, playbackData);
                    })
                    .catch(err => {
                        done(err);
                    });
            });

            testWrapper.destroy();
        });
    }
}

module.exports = TestHelpBlockContent;
