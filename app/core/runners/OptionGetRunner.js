'use strict';

const UIStepRunner = require('app/core/runners/UIStepRunner');
const config = require('app/config');
const basePath = config.app.basePath;

class OptionGetRunner extends UIStepRunner {

    handleGet(step, req, res) {
        if (req.params[0] === 'redirect') {
            const ctx = step.getContextData(req);
            res.redirect(basePath + step.nextStepUrl(ctx));
        } else {
            super.handleGet(step, req, res);
        }
    }

    handlePost(step, req, res) {
        req.log.error('Post operation not defined for OptionGetRunner');
        res.status(404);
        res.render('errors/404');
    }
}

module.exports = OptionGetRunner;
