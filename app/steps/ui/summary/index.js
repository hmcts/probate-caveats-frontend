'use strict';

const Step = require('app/core/steps/Step');
const isEmpty = require('lodash').isEmpty;
const FormatName = require('app/utils/FormatName');
const CheckAnswersSummaryJSONObjectBuilder = require('app/utils/CheckAnswersSummaryJSONObjectBuilder');
const checkAnswersSummaryJSONObjBuilder = new CheckAnswersSummaryJSONObjectBuilder();

class Summary extends Step {

    static getUrl(redirect = '*') {
        return `/summary/${redirect}`;
    }

    generateContent(ctx, formdata, language) {
        const content = {};

        Object.keys(this.steps)
            .filter((stepName) => stepName !== this.name)
            .forEach((stepName) => {
                const step = this.steps[stepName];
                content[stepName] = step.generateContent(formdata[step.section], formdata, language);
                content[stepName].url = step.constructor.getUrl();
            });
        content[this.name] = super.generateContent(ctx, formdata, language);
        content[this.name].url = Summary.getUrl();
        const deceasedName = FormatName.format(formdata.deceased);
        content.DeceasedAlias.question = content.DeceasedAlias.question.replace('{deceasedName}', deceasedName ? deceasedName : content.DeceasedAlias.theDeceased);
        return content;
    }

    generateFields(language, ctx, errors, formdata) {
        const fields = {};
        Object.keys(this.steps)
            .filter((stepName) => stepName !== this.name)
            .forEach((stepName) => {
                const step = this.steps[stepName];
                if (isEmpty(fields[step.section])) {
                    fields[step.section] = step.generateFields(language, formdata[step.section], errors, formdata);
                }
            });
        fields[this.section] = super.generateFields(language, ctx, errors, formdata);

        if (ctx) {
            fields.featureToggles = {};
            fields.featureToggles.value = ctx.featureToggles;
        }

        return fields;
    }

    renderPage(res, html) {
        const formdata = res.req.session.form;
        formdata.checkAnswersSummary = checkAnswersSummaryJSONObjBuilder.build(html);
        res.send(html);
    }
}

module.exports = Summary;
