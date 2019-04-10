'use strict';

const config = require('app/config');
const DateStep = require('app/core/steps/DateStep');
const FieldError = require('app/components/error');

class DeceasedDod extends DateStep {

    static getUrl() {
        return '/deceased-dod';
    }

    nextStepUrl(req, ctx) {
        return config.app.basePath + this.next(req, ctx).constructor.getUrl();
    }

    dateName() {
        return 'dod';
    }

    handlePost(ctx, errors, formdata, session) {
        let dob;
        if (session.form.deceased && session.form.deceased.dob_year && session.form.deceased.dob_month && session.form.deceased.dob_day) {
            dob = new Date(`${session.form.deceased.dob_year}-${session.form.deceased.dob_month}-${session.form.deceased.dob_day}`);
            dob.setHours(0, 0, 0, 0);
        }

        const dod = new Date(`${ctx.dod_year}-${ctx.dod_month}-${ctx.dod_day}`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dod > today) {
            errors.push(FieldError('dod_date', 'dateInFuture', this.resourcePath, this.generateContent()));
        } else if (typeof dob === 'object' && dob >= dod) {
            errors.push(FieldError('dod_date', 'dodBeforeDob', this.resourcePath, this.generateContent()));
        }

        return [ctx, errors];
    }

}

module.exports = DeceasedDod;
