import FormatName from '../../../app/utils/FormatName.js';
import TestWrapper from '../../util/TestWrapper.mjs';
import config from 'config';
import deceasedContentAddress from '../../../app/resources/en/translation/deceased/address.json' with {type: 'json'};
import deceasedContentAlias from '../../../app/resources/en/translation/deceased/alias.json' with {type: 'json'};
import deceasedContentDod from '../../../app/resources/en/translation/deceased/dod.json' with {type: 'json'};
import deceasedContentName from '../../../app/resources/en/translation/deceased/name.json' with {type: 'json'};
import deceasedContentOthernames from '../../../app/resources/en/translation/deceased/othernames.json' with {type: 'json'};
import deceasedData from '../../data/deceased.json' with {type: 'json'};
import summaryContent from '../../../app/resources/en/translation/summary.json' with {type: 'json'};

const deceasedContent = {
    address: deceasedContentAddress,
    alias: deceasedContentAlias,
    dod: deceasedContentDod,
    name: deceasedContentName,
    othernames: deceasedContentOthernames,
};
const basePath = config.app.basePath;

describe('summary-deceased-section', () => {
    let testWrapper, sessionData;

    beforeEach(async () => {
        testWrapper = await TestWrapper.getInstance('Summary');
        sessionData = structuredClone(deceasedData);
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
                        dod: deceasedContent.dod.question,
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
