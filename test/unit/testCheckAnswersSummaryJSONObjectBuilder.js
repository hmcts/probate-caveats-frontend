'use strict';

const CheckAnswersSummaryJSONObjectBuilder = require('app/utils/CheckAnswersSummaryJSONObjectBuilder');
const {assert} = require('chai');

let checkAnswersSummaryJSONObjBuilder;

const html = `
<!DOCTYPE html>
  <body>
    <h1 class="heading-large">Check your answers</h1>
    <p id="main-heading-content">Check the information below carefully. This will form a record of your application for probate. It will also be stored as a public record, and will be able to be viewed online.</p>
    
    <h2 class="heading-medium">The will</h2>
    <table class="check-your-answers check-your-answers--long">
        <tr class="check-your-answers__row">
            <th class="check-your-answers__question">Did the person who died leave a will?</th>
            <td class="check-your-answers__answer">Yes</td>
        </tr>
        <tr class="check-your-answers__row">
            <th class="check-your-answers__question">Do you have the original will?</th>
            <td class="check-your-answers__answer">Yes</td>
        </tr>
    </table>

    <h2 class="heading-medium">Inheritance tax</h2>
    <table class="check-your-answers check-your-answers--long">
        <tr class="check-your-answers__row">
            <th class="check-your-answers__question">Has an Inheritance Tax (IHT) form been filled in?</th>
            <td class="check-your-answers__answer">Yes</td>
        </tr>
        <tr class="check-your-answers__row">
            <th class="check-your-answers__question">How was the Inheritance Tax (IHT) form submitted?</th>
            <td class="check-your-answers__answer">By post</td>
        </tr>
    </table>

    <h2 class="heading-medium">The executors</h2>
    <table class="check-your-answers check-your-answers--long">
        <tr class="check-your-answers__row">
            <th class="check-your-answers__question">How many past and present executors are named on the will and any updates (&lsquo;codicils&rsquo;)?</th>
            <td class="check-your-answers__answer">1</td>
        </tr>
    </table>

    <h3 class="heading-small">About you</h3>
    <table class="check-your-answers check-your-answers--long">
        <tr class="check-your-answers__row">
            <th class="check-your-answers__question">First name(s)</th>
            <td class="check-your-answers__answer">Bobby</td>
        </tr>
        <tr class="check-your-answers__row">
            <th class="check-your-answers__question">Last name(s)</th>
            <td class="check-your-answers__answer">Brown</td>
        </tr>
    </table>

    <h2 class="heading-medium">About the person who died</h2>
    <table class="check-your-answers check-your-answers--long">
        <tr class="check-your-answers__row">
            <th class="check-your-answers__question">First name(s)</th>
            <td class="check-your-answers__answer">Graham</td>
        </tr>
        <tr class="check-your-answers__row">
            <th class="check-your-answers__question">Last name(s)</th>
            <td class="check-your-answers__answer">Greene</td>
        </tr>
    </table>
  </body>
</html>`;

describe('CheckAnswersSummaryJSONObjectBuilder', function () {
    beforeEach(() => {
        checkAnswersSummaryJSONObjBuilder = new CheckAnswersSummaryJSONObjectBuilder();
    });

    describe('build()', () => {
        it('should build the json object from html', (done) => {
            const checkAnswersSummary = checkAnswersSummaryJSONObjBuilder.build(html);
            assert.exists(checkAnswersSummary);
            assertPropertyExistsAndIsEqualTo(checkAnswersSummary.mainParagraph,
                'Check the information below carefully. This will form a record of your application for probate. It will also be stored as a public record, and will be able to be viewed online.');
            assertPropertyExistsAndIsEqualTo(checkAnswersSummary.pageTitle, 'Check your answers');
            assert.isArray(checkAnswersSummary.sections, 'Sections exists');
            assert.lengthOf(checkAnswersSummary.sections, 5, 'Section array has length of 5');

            const willSection = checkAnswersSummary.sections[0];
            assertPropertyExistsAndIsEqualTo(willSection.title, 'The will');
            assertPropertyExistsAndIsEqualTo(willSection.type, 'heading-medium');
            assert.isArray(willSection.questionAndAnswers);
            assert.lengthOf(willSection.questionAndAnswers, 2, 'Will Section array has 2 questionsAndAnswers');

            assertQuestionAndAnswer(willSection.questionAndAnswers[0], 'Did the person who died leave a will?', 'Yes');
            assertQuestionAndAnswer(willSection.questionAndAnswers[1], 'Do you have the original will?', 'Yes');

            const ihtSection = checkAnswersSummary.sections[1];
            assertPropertyExistsAndIsEqualTo(ihtSection.title, 'Inheritance tax');
            assertPropertyExistsAndIsEqualTo(ihtSection.type, 'heading-medium');

            assert.isArray(ihtSection.questionAndAnswers);
            assert.lengthOf(ihtSection.questionAndAnswers, 2, 'IHT Section array has 2 questionsAndAnswers');

            assertQuestionAndAnswer(ihtSection.questionAndAnswers[0], 'Has an Inheritance Tax (IHT) form been filled in?', 'Yes');
            assertQuestionAndAnswer(ihtSection.questionAndAnswers[1], 'How was the Inheritance Tax (IHT) form submitted?', 'By post');

            const executorsSection = checkAnswersSummary.sections[2];
            assertPropertyExistsAndIsEqualTo(executorsSection.title, 'The executors');
            assertPropertyExistsAndIsEqualTo(executorsSection.type, 'heading-medium');

            assert.isArray(executorsSection.questionAndAnswers);
            assert.lengthOf(executorsSection.questionAndAnswers, 1, 'Executors Section array has 1 questionsAndAnswers');
            assertQuestionAndAnswer(executorsSection.questionAndAnswers[0], 'How many past and present executors are named on the will and any updates (‘codicils’)?', '1');

            const aboutYouSection = checkAnswersSummary.sections[3];
            assertPropertyExistsAndIsEqualTo(aboutYouSection.title, 'About you');
            assertPropertyExistsAndIsEqualTo(aboutYouSection.type, 'heading-small');

            assert.isArray(aboutYouSection.questionAndAnswers);
            assert.lengthOf(aboutYouSection.questionAndAnswers, 2, 'About You Section array has 2 questionsAndAnswers');
            assertQuestionAndAnswer(aboutYouSection.questionAndAnswers[0], 'First name(s)', 'Bobby');
            assertQuestionAndAnswer(aboutYouSection.questionAndAnswers[1], 'Last name(s)', 'Brown');

            const aboutThePersonWhoDiedSection = checkAnswersSummary.sections[4];
            assertPropertyExistsAndIsEqualTo(aboutThePersonWhoDiedSection.title, 'About the person who died');
            assertPropertyExistsAndIsEqualTo(aboutThePersonWhoDiedSection.type, 'heading-medium');

            assert.isArray(aboutThePersonWhoDiedSection.questionAndAnswers);
            assert.lengthOf(aboutThePersonWhoDiedSection.questionAndAnswers, 2, 'About The Person Who Died Section array has 2 questionsAndAnswers');

            assertQuestionAndAnswer(aboutThePersonWhoDiedSection.questionAndAnswers[0], 'First name(s)', 'Graham');
            assertQuestionAndAnswer(aboutThePersonWhoDiedSection.questionAndAnswers[1], 'Last name(s)', 'Greene');
            done();
        });
    });

    function assertPropertyExistsAndIsEqualTo(value, equalto) {
        assert.exists(value);
        assert.equal(value, equalto);
    }

    function assertQuestionAndAnswer(questionAndAnswers, question, answer) {
        assertPropertyExistsAndIsEqualTo(questionAndAnswers.question, question);
        assert.isArray(questionAndAnswers.answers);
        assert.lengthOf(questionAndAnswers.answers, 1);
        assertPropertyExistsAndIsEqualTo(questionAndAnswers.answers[0], answer);
    }
});
