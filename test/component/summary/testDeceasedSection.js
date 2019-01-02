'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
//
// const deceasedData
// = require('test/data/deceased');
// const deceasedContent = requireDir(module, '../../../app/resources/en/translation/deceased');
const FormatName = require('app/utils/FormatName');

describe('summary-deceased-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        //sessionData = require('test/data/deceased');
        sessionData = '';
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on deceased section of the summary page , when no data is entered', (done) => {
            const playbackData = {
                // firstName: deceasedContent.name.firstName,
                // lastName: deceasedContent.name.lastName,
                // alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedContent.alias.theDeceased),
                // dod: deceasedContent.dod.question,
                // dob: deceasedContent.dob.question,
                // domicile: deceasedContent.domicile.question,
                // address: deceasedContent.address.question
            };
            testWrapper.testDataPlayback(done, playbackData);
        });

        it('test correct content loaded on the deceased section of the summary page, when section is complete', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const deceasedName = FormatName.format(deceasedData.deceased);
                    const playbackData = {
                        // firstName: deceasedContent.name.firstName,
                        // lastName: deceasedContent.name.lastName,
                        // alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        // married: deceasedContent.married.question.replace('{deceasedName}', deceasedName),
                        // dod: deceasedContent.dod.question,
                        // dob: deceasedContent.dob.question,
                        // domicile: deceasedContent.domicile.question,
                        // address: deceasedContent.address.question
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test data is played back correctly on the deceased section of the summary page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const deceasedName = FormatName.format(deceasedData.deceased);
                    const playbackData = {
                        // firstName: deceasedContent.name.firstName,
                        // lastName: deceasedContent.name.lastName,
                        // alias: deceasedContent.alias.question,
                        // married: deceasedContent.married.question.replace('{deceasedName}', deceasedName),
                        // dod: deceasedContent.dod.question,
                        // dob: deceasedContent.dob.question,
                        // domicile: deceasedContent.domicile.question,
                        // address: deceasedContent.address.question
                    };
                    Object.assign(playbackData, deceasedData.deceased, deceasedData.will);
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

    });
});
