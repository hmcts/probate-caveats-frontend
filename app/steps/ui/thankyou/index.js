'use strict';

const Step = require('app/core/steps/Step');

class ThankYou extends Step {

    static getUrl () {
        return '/thankyou';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.ccdReferenceNumber = '';
        if (req.session.form.ccdCase && req.session.form.ccdCase.id) {
            ctx.ccdReferenceNumber = req.session.form.ccdCase.id.toString();

            if (!ctx.ccdReferenceNumber.includes('-')) {
                ctx.ccdReferenceNumber = ctx.ccdReferenceNumber.match(/.{1,4}/g);
                ctx.ccdReferenceNumber = ctx.ccdReferenceNumber.join('-');
            }
        }
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.ccdReferenceNumber;
        return [ctx, formdata];
    }
}

module.exports = ThankYou;
