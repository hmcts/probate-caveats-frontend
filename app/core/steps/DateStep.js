'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const moment = require('moment');
const config = require('config');
const utils = require('app/components/step-utils');
const FieldError = require('app/components/error');
const {remove} = require('lodash');

class DateStep extends ValidationStep {

    dateName() {
        return null;
    }

    getContextData(req) {
        let ctx = super.getContextData(req);
        ctx = this.parseDate(ctx, this.dateName(), req.session.language);
        return ctx;
    }

    parseDate(ctx, dateNames, language = 'en') {
        dateNames.forEach((dateName) => {
            const [day, month, year] = [`${dateName}-day`, `${dateName}-month`, `${dateName}-year`];

            ctx[day] = ctx[day] ? parseInt(ctx[day]) : ctx[day];
            ctx[month] = ctx[month] ? parseInt(ctx[month]) : ctx[month];
            ctx[year] = ctx[year] ? parseInt(ctx[year]) : ctx[year];

            const date = moment(`${ctx[day]}/${ctx[month]}/${ctx[year]}`, config.dateFormat).parseZone();

            ctx[`${dateName}-date`] = '';

            if (date.isValid()) {
                ctx[`${dateName}-date`] = date.toISOString();
                ctx[`${dateName}-formattedDate`] = utils.formattedDate(date, language);
            }
        });

        return ctx;
    }

    validate(ctx, formdata, language) {
        let [isValid, errors] = [true, []];
        [isValid, errors] = super.validate(ctx, formdata, language);

        const dateNames = this.dateName();

        dateNames.forEach((dateName) => {
            if (!ctx[`${dateName}-day`] && !ctx[`${dateName}-month`] && !ctx[`${dateName}-year`]) {
                errors.push(FieldError(`${dateName}-date`, 'required', this.resourcePath, this.generateContent({}, {}, language), language));
                isValid = false;

                remove(errors, (error) => {
                    return error.field === `${dateName}-day` || error.field === `${dateName}-month` || error.field === `${dateName}-year`;
                });
            }
        });

        return [isValid, errors];
    }
}

module.exports = DateStep;
