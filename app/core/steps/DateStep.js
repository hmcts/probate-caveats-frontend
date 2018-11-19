'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const moment = require('moment');
const config = require('app/config');
const utils = require('app/components/step-utils');

class DateStep extends ValidationStep {

    getContextData(req) {
        const ctx = super.getContextData(req);
        let dateNames = this.dateName();

        if (typeof dateNames === 'string') {
            dateNames = new Array(dateNames);
        }

        dateNames.forEach(dateName => {
            this.parseDate(ctx, dateName);
        });

        return ctx;
    }

    parseDate(ctx, dateName) {
        const [day, month, year] = [`${dateName}_day`, `${dateName}_month`, `${dateName}_year`];

        ctx[day] = ctx[day] ? parseInt(ctx[day]) : ctx[day];
        ctx[month] = ctx[month] ? parseInt(ctx[month]) : ctx[month];
        ctx[year] = ctx[year] ? parseInt(ctx[year]) : ctx[year];

        const date = moment(`${ctx[day]}/${ctx[month]}/${ctx[year]}`, config.dateFormat);

        ctx[`${dateName}_date`] = date.toISOString();
        if (date.isValid()) {
            ctx[`${dateName}_formattedDate`] = this.formattedDate(date);
        }
    }

    formattedDate(date) {
        const month = utils.commonContent().months.split(',')[date.month()].trim();
        return `${date.date()} ${month} ${date.year()}`;
    }
}

module.exports = DateStep;
