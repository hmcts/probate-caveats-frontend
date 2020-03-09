'use strict';

const UIStepRunner = require('app/core/runners/UIStepRunner');
const co = require('co');
const uuidv4 = require('uuid/v4');
const config = require('config');
const basePath = config.app.basePath;

class RedirectRunner extends UIStepRunner {

    handleGet(step, req, res) {
        const originalHandleGet = super.handleGet;

        return co(function* () {
            const ctx = step.getContextData(req);

            if (!req.session.form.applicationId) {
                req.log.error('req.session.form.applicationId does not exist');
                req.session.form.applicationId = uuidv4();
            }

            const options = yield step.runnerOptions(ctx, req.session.form, req.session.language);
            if (options.redirect) {
                res.redirect(basePath + options.url);
            } else {
                req.errors = options.errors;
                return originalHandleGet(step, req, res);
            }
        }).catch((error) => {
            const commonContent = require(`app/resources/${req.session.language}/translation/common`);

            req.log.error(error);
            res.status(500).render('errors/500', {common: commonContent});
        });
    }
}

module.exports = RedirectRunner;
