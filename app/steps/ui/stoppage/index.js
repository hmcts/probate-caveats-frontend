'use strict';

const Step = require('app/core/steps/Step');

class StopPage extends Step {

    static getUrl(reason = '*') {
        return `/stop-page/${reason}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.stopReason = req.params[0];

        const formdata = req.session.form;
        const templateContent = this.generateContent(ctx, formdata)[ctx.stopReason];

        if (templateContent) {
            ctx.linkPlaceholders = this.replaceLinkPlaceholders(templateContent);
        }

        return ctx;
    }

    * handleGet(ctx, formdata) {
        [ctx] = yield super.handleGet(ctx, formdata);
        return [ctx, {}];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.linkPlaceholders;

        return [ctx, formdata];
    }

    replaceLinkPlaceholders(templateContent) {
        const linkPlaceholders = templateContent.match(/{[^}]+}/g);

        if (linkPlaceholders) {
            return linkPlaceholders.map(placeholder => placeholder.substr(1, placeholder.length - 2));
        }

        return [];
    }
}

module.exports = StopPage;
