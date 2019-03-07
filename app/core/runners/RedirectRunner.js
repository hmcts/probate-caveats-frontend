'use strict';

const UIStepRunner = require('app/core/runners/UIStepRunner');
const co = require('co');

class RedirectRunner extends UIStepRunner {

    handleGet(step, req, res) {
        const originalHandleGet = super.handleGet;

        return co(function* () {
            const ctx = step.getContextData(req);

            if (!req.session.form.applicantEmail) {
                req.log.error('req.session.form.applicantEmail does not exist');
            }

            req.session.form.applicantEmail = req.session.regId;
            const options = yield step.runnerOptions(ctx, req.session.form);
            if (options.redirect) {
                res.redirect(options.url);
            } else {
                req.errors = options.errors;
                return originalHandleGet(step, req, res);
            }
        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/500');
        });
    }
}

module.exports = RedirectRunner;
