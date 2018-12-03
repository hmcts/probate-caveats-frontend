'use strict';

const DateStep = require('app/core/steps/DateStep');

class DeceasedDod extends DateStep {

    static getUrl() {
        return '/deceased-dod';
    }

    dateName() {
        return 'dod';
    }

    handlePost(ctx, errors, formdata, session, hostname) {
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = DeceasedDod;
