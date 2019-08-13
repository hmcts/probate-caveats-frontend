'use strict';

const cheerio = require('cheerio');

class CheckAnswersSummaryJSONObjectBuilder {

    build(html) {
        const $ = cheerio.load(html);
        const summary = {};
        summary.sections = [];
        const sections = $(
            '#check-your-answers .govuk-heading-l,' +
            '#check-your-answers .govuk-heading-m,' +
            '#check-your-answers .govuk-heading-s,' +
            '#check-your-answers .govuk-summary-list .govuk-summary-list__row'
        );
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
            if ($element.hasClass('govuk-summary-list__row') && $element.children().length > 0) {
                buildQuestionAndAnswers($element, section);
            }
        }
        return summary;
    }
}

const buildQuestionAndAnswers = ($element, section) => {
    const question = $element.children('.govuk-summary-list__key');
    const answer = $element.children('.govuk-summary-list__value');
    const questionAndAnswer = {};

    questionAndAnswer.question = question.text();
    questionAndAnswer.answers = [];
    const answer_rows = answer.children('.govuk-summary-list__row');
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
};

const buildSection = (section, $element, summary, className) => {
    section = {};
    section.title = $element.text();
    section.type = className;
    section.questionAndAnswers = [];
    summary.sections.push(section);
    return section;
};

module.exports = CheckAnswersSummaryJSONObjectBuilder;
