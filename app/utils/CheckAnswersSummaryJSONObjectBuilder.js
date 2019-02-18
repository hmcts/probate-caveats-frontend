'use strict';

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

class CheckAnswersSummaryJSONObjectBuilder {

    build(html) {
        const dom = new JSDOM(html);
        const $ = (require('jquery'))(dom.window);
        const summary = {};
        summary.sections = [];
        const sections = $('.heading-large, .heading-medium, .heading-small, .check-your-answers__row');
        const mainParagraph = $('#main-heading-content');
        summary.mainParagraph = mainParagraph.html();
        let section;
        for (const sectElement of sections) {
            const $element = $(sectElement);
            if ($element.hasClass('heading-large')) {
                summary.pageTitle = $element.html();
            }
            if ($element.hasClass('heading-medium') || $element.hasClass('heading-small')) {
                section = buildSection(section, $element, summary);
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
    const questionAndAnswer = {};

    questionAndAnswer.question = question.html();
    questionAndAnswer.answers = [];
    const children = answer.children('.check-your-answers__row');
    if (children.length > 0) {
        for (const answerChild of children) {
            questionAndAnswer.answers.push(answerChild.textContent);
        }
    } else {
        questionAndAnswer.answers.push(answer.html());
    }
    section.questionAndAnswers.push(questionAndAnswer);
}

function buildSection(section, $element, summary) {
    section = {};
    section.title = $element.html();
    section.type = $element.attr('class');
    section.questionAndAnswers = [];
    summary.sections.push(section);
    return section;
}

module.exports = CheckAnswersSummaryJSONObjectBuilder;
