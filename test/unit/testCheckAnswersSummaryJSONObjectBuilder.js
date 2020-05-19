'use strict';

const CheckAnswersSummaryJSONObjectBuilder = require('app/utils/CheckAnswersSummaryJSONObjectBuilder');
const {assert} = require('chai');

let checkAnswersSummaryJSONObjBuilder;

const html = `
<!DOCTYPE html>
<html>
<body>
    <div class="govuk-width-container">
        <main class="govuk-main-wrapper " id="main-content" role="main">
            <div id="check-your-answers">
                <h1 class="govuk-heading-l">Check your answers</h1>
                <p class="govuk-body" id="main-heading-content">Check the information below carefully. This will form a record of your application for probate. It will also be stored as a public record, and will be able to be viewed online.</p>
    
                <h2 class="govuk-heading-m">About the person who died</h2>
                <dl class="govuk-summary-list">
                    <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">First name and any middle names</dt>
                        <dd class="govuk-summary-list__value">Test GDS - on Pr-889 FN</dd>
                        <dd class="govuk-summary-list__actions">
                            <a class="govuk-link" href="/deceased-name">Change</a>
                        </dd>
                    </div>
                    <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">Last name</dt>
                        <dd class="govuk-summary-list__value">Test GDS - on Pr-889 FN</dd>
                        <dd class="govuk-summary-list__actions">
                            <a class="govuk-link" href="/deceased-name">Change</a>
                        </dd>
                    </div>
                    <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">Did Test GDS - on Pr-889 FN Test GDS - on Pr-889 FN have assets in another name?</dt>
                        <dd class="govuk-summary-list__value">Yes</dd>
                        <dd class="govuk-summary-list__actions">
                            <a class="govuk-link" href="/deceased-alias">Change</a>
                        </dd>
                    </div>
                    <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">Names used by the deceased</dt>
                        <dd class="govuk-summary-list__value">
                            <div class="govuk-summary-list__row">
                                Other Test GDS - on Pr-889 FN Other Test GDS - on Pr-889 FN
                            </div>
                            <div class="govuk-summary-list__row">
                                dsfa fdsfas
                            </div>
                        </dd>
                        <dd class="govuk-summary-list__actions">
                            <a href="/other-names">Change</a>
                        </dd>
                    </div>
                </dl>
    
                <h2 class="govuk-heading-m">Uploaded documents</h2>
                <dl class="govuk-summary-list">
                    <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">Death Certificate</dt>
                        <dd class="govuk-summary-list__value">
                            <div class="check-your-answers__row">
                                Screenshot 2019-08-05 at 10.42.17.png
                            </div>
                        </dd>
                        <dd class="govuk-summary-list__actions">
                            <a class="govuk-link" href="/document-upload">Change</a>
                        </dd>
                    </div>
                </dl>
    
                <h2 class="govuk-heading-m">Inheritance tax</h2>
                <dl class="govuk-summary-list">
                    <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">How was the Inheritance Tax (IHT) form submitted?</dt>
                        <dd class="govuk-summary-list__value">By post</dd>
                        <dd class="govuk-summary-list__actions">
                            <a class="govuk-link" href="/iht-method">Change</a>
                        </dd>
                    </div>
                    <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">Which paper form was filled in?</dt>
                        <dd class="govuk-summary-list__value">IHT 205 - there was no inheritance tax to pay</dd>
                        <dd class="govuk-summary-list__actions">
                            <a class="govuk-link" href="/iht-paper">Change</a>
                        </dd>
                    </div>
                </dl>
    
                <h2 class="govuk-heading-m">The executors</h2>
                <dl class="govuk-summary-list">
                    <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">How many past and present executors are named on the will and any updates (&lsquo;codicils&rsquo;)?</dt>
                        <dd class="govuk-summary-list__value">7</dd>
                        <dd class="govuk-summary-list__actions">
                            <a class="govuk-link" href="/executors-number">Change</a>
                        </dd>
                    </div>
                </dl>
    
                <h3 class="govuk-heading-s">About you</h3>
                <dl class="govuk-summary-list">
                    <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">First name and any middle names</dt>
                        <dd class="govuk-summary-list__value">Application-name FN</dd>
                        <dd class="govuk-summary-list__actions">
                            <a class="govuk-link" href="/applicant-name">Change</a>
                        </dd>
                    </div>
                    <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">Last name</dt>
                        <dd class="govuk-summary-list__value">Application-name LN</dd>
                        <dd class="govuk-summary-list__actions">
                            <a class="govuk-link" href="/applicant-name">Change</a>
                        </dd>
                    </div>
                </dl>
            </div>
        </main>
    </div>
</body>
</html>`;

describe('CheckAnswersSummaryJSONObjectBuilder', () => {
    beforeEach(() => {
        checkAnswersSummaryJSONObjBuilder = new CheckAnswersSummaryJSONObjectBuilder();
    });

    describe('build()', () => {
        it('should build the json object from html', (done) => {
            const checkAnswersSummary = checkAnswersSummaryJSONObjBuilder.build(html);
            assert.exists(checkAnswersSummary);
            assertPropertyExistsAndIsEqualTo(checkAnswersSummary.mainParagraph, 'Check the information below carefully. This will form a record of your application for probate. It will also be stored as a public record, and will be able to be viewed online.');
            assertPropertyExistsAndIsEqualTo(checkAnswersSummary.pageTitle, 'Check your answers');
            assert.isArray(checkAnswersSummary.sections, 'Sections exists');
            assert.lengthOf(checkAnswersSummary.sections, 5, 'Section array has length of 5');

            const aboutThePersonWhoDiedSection = checkAnswersSummary.sections[0];
            assertPropertyExistsAndIsEqualTo(aboutThePersonWhoDiedSection.title, 'About the person who died');
            assertPropertyExistsAndIsEqualTo(aboutThePersonWhoDiedSection.type, 'govuk-heading-m');

            assert.isArray(aboutThePersonWhoDiedSection.questionAndAnswers);
            assert.lengthOf(aboutThePersonWhoDiedSection.questionAndAnswers, 4, 'About The Person Who Died section array has 4 questionsAndAnswers');

            assertQuestionAndAnswer(aboutThePersonWhoDiedSection.questionAndAnswers[0], 'First name and any middle names', 'Test GDS - on Pr-889 FN');
            assertQuestionAndAnswer(aboutThePersonWhoDiedSection.questionAndAnswers[1], 'Last name', 'Test GDS - on Pr-889 FN');
            assertQuestionAndAnswer(aboutThePersonWhoDiedSection.questionAndAnswers[2], 'Did Test GDS - on Pr-889 FN Test GDS - on Pr-889 FN have assets in another name?', 'Yes');
            const answers = ['Other Test GDS - on Pr-889 FN Other Test GDS - on Pr-889 FN', 'dsfa fdsfas'];
            assertQuestionAndAnswers(aboutThePersonWhoDiedSection.questionAndAnswers[3], 'Names used by the deceased', answers, 2);

            const ihtSection = checkAnswersSummary.sections[2];
            assertPropertyExistsAndIsEqualTo(ihtSection.title, 'Inheritance tax');
            assertPropertyExistsAndIsEqualTo(ihtSection.type, 'govuk-heading-m');

            assert.isArray(ihtSection.questionAndAnswers);
            assert.lengthOf(ihtSection.questionAndAnswers, 2, 'IHT section array has 2 questions and answers');

            assertQuestionAndAnswer(ihtSection.questionAndAnswers[0], 'How was the Inheritance Tax (IHT) form submitted?', 'By post');
            assertQuestionAndAnswer(ihtSection.questionAndAnswers[1], 'Which paper form was filled in?', 'IHT 205 - there was no inheritance tax to pay');

            const executorsSection = checkAnswersSummary.sections[3];
            assertPropertyExistsAndIsEqualTo(executorsSection.title, 'The executors');
            assertPropertyExistsAndIsEqualTo(executorsSection.type, 'govuk-heading-m');

            assert.isArray(executorsSection.questionAndAnswers);
            assert.lengthOf(executorsSection.questionAndAnswers, 1, 'Executors section array has 1 questions and answers');
            assertQuestionAndAnswer(executorsSection.questionAndAnswers[0], 'How many past and present executors are named on the will and any updates (‘codicils’)?', '7');

            const aboutYouSection = checkAnswersSummary.sections[4];
            assertPropertyExistsAndIsEqualTo(aboutYouSection.title, 'About you');
            assertPropertyExistsAndIsEqualTo(aboutYouSection.type, 'govuk-heading-s');

            assert.isArray(aboutYouSection.questionAndAnswers);
            assert.lengthOf(aboutYouSection.questionAndAnswers, 2, 'About You section array has 2 questions and answers');
            assertQuestionAndAnswer(aboutYouSection.questionAndAnswers[0], 'First name and any middle names', 'Application-name FN');
            assertQuestionAndAnswer(aboutYouSection.questionAndAnswers[1], 'Last name', 'Application-name LN');

            done();
        });
    });

    const assertPropertyExistsAndIsEqualTo = (value, equalto) => {
        assert.exists(value);
        assert.equal(value, equalto);
    };

    const assertQuestionAndAnswer = (questionAndAnswers, question, answer) => {
        assertPropertyExistsAndIsEqualTo(questionAndAnswers.question, question);
        assert.isArray(questionAndAnswers.answers);
        assert.lengthOf(questionAndAnswers.answers, 1);
        assertPropertyExistsAndIsEqualTo(questionAndAnswers.answers[0], answer);
    };

    const assertQuestionAndAnswers = (questionAndAnswers, question, answers, length) => {
        assertPropertyExistsAndIsEqualTo(questionAndAnswers.question, question);
        assert.isArray(questionAndAnswers.answers);
        assert.lengthOf(questionAndAnswers.answers, length);
        for (let i = 0; i < length; i++) {
            assertPropertyExistsAndIsEqualTo(questionAndAnswers.answers[i], answers[i]);
        }
    };
});
