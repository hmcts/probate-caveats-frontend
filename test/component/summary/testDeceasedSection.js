'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');

const deceasedData = require('test/data/deceased');
const deceasedContent = requireDir(module, '../../../app/resources/en/translation/deceased');
const summaryContent = require('app/resources/en/translation/summary');
const FormatName = require('app/utils/FormatName');
const config = require('config');
const basePath = config.app.basePath;

describe('summary-deceased-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = require('test/data/deceased');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on deceased section of the summary page , when no data is entered', (done) => {
            const sessionData = {
                applicant: {
                    firstName: 'value'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        firstName: deceasedContent.name.firstName,
                        lastName: deceasedContent.name.lastName,
                        alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedContent.alias.theDeceased),
                        dobKnown: deceasedContent.dobknown.question.replace('{deceasedName}', ''),
                        dod: deceasedContent.dod.question,
                        address: deceasedContent.address.question.replace('{deceasedName}', ''),
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test data is played back correctly on the deceased with no alias section of the summary page', (done) => {
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const deceasedName = FormatName.format(deceasedData.deceased);
                    const playbackData = {
                        firstName: deceasedContent.name.firstName,
                        lastName: deceasedContent.name.lastName,
                        alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        dobKnown: deceasedContent.dobknown.question.replace('{deceasedName}', deceasedName),
                        dod: deceasedContent.dod.question,
                        dob: deceasedContent.dob.question,
                        address: deceasedContent.address.question
                    };
                    Object.assign(playbackData, deceasedData.deceased);
                    playbackData.address = deceasedData.deceased.address.formattedAddress;

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test data is played back correctly on the deceased with alias section of the summary page', (done) => {
            const sessionData = {
                applicant: {
                    firstName: 'value'
                },
                deceased: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    alias: 'optionYes',
                    otherNames: {
                        name_0: {
                            firstName: 'new_died_firstname',
                            lastName: 'new_died_lastname'
                        }
                    }
                }
            };
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const deceasedName = FormatName.format(deceasedData.deceased);
                    const playbackData = {
                        firstName: deceasedContent.name.firstName,
                        lastName: deceasedContent.name.lastName,
                        alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        othernames: summaryContent.otherNamesLabel,
                        othernamesfirstname: sessionData.deceased.otherNames.name_0.firstName,
                        othernameslastname: sessionData.deceased.otherNames.name_0.lastName
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

    });
});
