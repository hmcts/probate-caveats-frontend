'use strict';

const cheerio = require('cheerio');

class CheckAnswersSummaryJSONObjectBuilder {

    build(html) {
        const $ = cheerio.load(html);
        const summary = {};
        summary.sections = [];
        const sections = $('.govuk-heading-l, .govuk-heading-m, .govuk-heading-s, .check-your-answers__row');
        const mainParagraph = $('#main-heading-content');
        summary.mainParagraph = mainParagraph.text();
        let section;
        for (const sectElement of Object.entries(sections)) {
            const $element = $(sectElement);
            if ($element.hasClass('govuk-heading-l')) {
                summary.pageTitle = $element.text();
            }
            if ($element.hasClass('govuk-heading-m')) {
                section = buildSection(section, $element, summary, 'govuk-heading-m');
            }
            if ($element.hasClass('govuk-heading-s')) {
                section = buildSection(section, $element, summary, 'govuk-heading-s');
            }
            if ($element.hasClass('check-your-answers__row') && $element.children().length > 0) {
                buildQuestionAndAnswers($element, section);
            }
        }
        return summary;
    }
}

function buildQuestionAndAnswers($element, section) {
    const question = $element.children('.check-your-answers__question');
    const answer = $element.children('.check-your-answers__answer');
    const answer_rows = answer.children('.check-your-answers__row');
    const questionAndAnswer = {};

    questionAndAnswer.question = question.text();
    questionAndAnswer.answers = [];
    if (answer_rows.length > 0) {
        const rows = answer_rows.parent().text()
            .split('\n');
        for (let i = 0; i < rows.length; ++i) {
            if (rows[i].trim().length > 0) {
                questionAndAnswer.answers.push(rows[i].trim());
            }
        }
    } else {
        questionAndAnswer.answers.push(answer.text());
    }
    section.questionAndAnswers.push(questionAndAnswer);
}

function buildSection(section, $element, summary, className) {
    section = {};
    section.title = $element.text();
    section.type = className;
    section.questionAndAnswers = [];
    summary.sections.push(section);
    return section;
}

module.exports = CheckAnswersSummaryJSONObjectBuilder;
