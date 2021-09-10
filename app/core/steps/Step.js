'use strict';

const {mapValues, map, reduce, escape, isObject, isEmpty} = require('lodash');
const UIStepRunner = require('app/core/runners/UIStepRunner');
const journeyMap = require('app/core/journeyMap');
const mapErrorsToFields = require('app/components/error').mapErrorsToFields;
const config = require('config');
const FeatureToggle = require('app/utils/FeatureToggle');
const utils = require('app/components/step-utils');
const moment = require('moment');

class Step {

    static getUrl() {
        throw new ReferenceError('Step must override #url');
    }

    get name() {
        return this.constructor.name;
    }

    runner() {
        return new UIStepRunner();
    }

    get template() {
        if (!this.templatePath) {
            throw new TypeError(`Step ${this.name} has no template file in its resource folder`);
        }
        return `${this.templatePath}/template`;
    }

    constructor(steps, section, resourcePath, i18next, schema, language = 'en') {
        this.steps = steps;
        this.section = section;
        this.resourcePath = resourcePath;
        this.templatePath = `ui/${resourcePath}`;
        this.content = require(`app/resources/${language}/translation/${resourcePath}`);
        this.i18next = i18next;
    }

    next(ctx) {
        return journeyMap(this, ctx);
    }

    nextStepUrl(ctx) {
        return config.app.basePath + this.next(ctx).constructor.getUrl();
    }

    getContextData(req) {
        const session = req.session;
        let ctx = {};
        Object.assign(ctx, session.form[this.section] || {});
        ctx.sessionID = req.sessionID;
        ctx.language = req.session.language ? req.session.language : 'en';
        ctx = Object.assign(ctx, req.body);
        ctx = FeatureToggle.appwideToggles(req, ctx, config.featureToggles.appwideToggles);
        ctx.isAvayaWebChatEnabled = ctx.featureToggles && ctx.featureToggles.ft_avaya_webchat && ctx.featureToggles.ft_avaya_webchat === 'true';

        return ctx;
    }

    handleGet(ctx) {
        return [ctx];
    }

    handlePost(ctx, errors) {
        return [ctx, errors];
    }

    validate() {
        return [true, []];
    }

    isComplete() {
        return [this.validate()[0], 'noProgress'];
    }

    generateContent(ctx, formdata, language = 'en') {
        if (!this.content) {
            throw new ReferenceError(`Step ${this.name} has no content.json in its resource folder`);
        }
        const contentCtx = Object.assign({}, formdata, ctx, this.commonProps);
        this.i18next.changeLanguage(language);

        return mapValues(this.content, (value, key) => this.i18next.t(`${this.resourcePath.replace(/\//g, '.')}.${key}`, contentCtx));
    }

    commonContent(language = 'en') {
        this.i18next.changeLanguage(language);
        const common = require(`app/resources/${language}/translation/common`);
        return mapValues(common, (value, key) => this.i18next.t(`common.${key}`));
    }

    generateFields(language, ctx, errors) {
        let fields = mapValues(ctx, (value, key) => {
            let returnValue;
            const dateName = key.split('-')[0];

            if (key.includes('formattedDate') && ctx[`${dateName}-day`] && ctx[`${dateName}-month`] && ctx[`${dateName}-year`]) {
                const date = moment(ctx[`${dateName}-day`] + '/' + ctx[`${dateName}-month`] + '/' + ctx[`${dateName}-year`], config.dateFormat).parseZone();
                returnValue = utils.formattedDate(date, language);
            } else {
                returnValue = isObject(value) ? value : escape(value);
            }

            return {
                value: returnValue,
                error: false
            };
        });
        if (!isEmpty(errors)) {
            fields = mapErrorsToFields(fields, errors);
        }
        return fields;
    }

    action(ctx, formdata) {
        delete ctx.sessionID;
        delete ctx._csrf;
        return [ctx, formdata];
    }

    anySoftStops(formdata, ctx) {
        const softStopsList = map(this.steps, step => step.isSoftStop(formdata, ctx));
        const isSoftStop = reduce(softStopsList, (accumulator, nextElement) => {
            return accumulator || nextElement.isSoftStop;
        }, false);
        return isSoftStop;
    }

    isSoftStop() {
        return {
            'stepName': this.constructor.name,
            'isSoftStop': false
        };
    }

    setHardStop(ctx, reason) {
        ctx.stopReason = reason;
    }

    renderPage(res, html) {
        res.send(html);
    }
}

module.exports = Step;
