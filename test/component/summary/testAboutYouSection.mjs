import TestWrapper from '../../util/TestWrapper.js';
import applicantContentAddress from '../../../app/resources/en/translation/applicant/address.json' with {type: 'json'};
import applicantContentEmail from '../../../app/resources/en/translation/applicant/email.json' with {type: 'json'};
import applicantContentName from '../../../app/resources/en/translation/applicant/name.json' with {type: 'json'};
import applicantData from '../../data/applicant.json' with {type: 'json'};
import config from 'config';
import languageContent from '../../../app/resources/en/translation/language.json' with {type: 'json'};

const applicantContent = {
    address: applicantContentAddress,
    email: applicantContentEmail,
    name: applicantContentName,
};
const basePath = config.app.basePath;

describe('summary-about-you-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = structuredClone(applicantData);
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
