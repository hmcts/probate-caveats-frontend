'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const moment = require('moment');
const config = require('config');
const utils = require('app/components/step-utils');

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
}

module.exports = DateStep;
