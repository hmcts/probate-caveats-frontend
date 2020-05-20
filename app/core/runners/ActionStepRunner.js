'use strict';

const co = require('co');
const {curry} = require('lodash');
const config = require('config');

class ActionStepRunner {

    constructor() {
        this.GET = curry(this.handleGet);
        this.POST = curry(this.handlePost);
    }

    handleGet(step, req, res) {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);

        req.log.error(`GET operation not defined for ${step.name} step`);
        res.status(404);
        res.render('errors/404', {common: commonContent});
    }

    handlePost(step, req, res) {
        return co(function* () {
            const session = req.session;
            const formdata = session.form;

            let ctx = yield step.getContextData(req);
            let [, errors] = step.validate(ctx, formdata, session.language);

            [ctx, errors] = yield step.handlePost(ctx, errors, formdata, session);

            const next = step.next(req, ctx);
            step.action(ctx, formdata);
            res.redirect(config.app.basePath + next.constructor.getUrl());
        }).catch((error) => {
            const commonContent = require(`app/resources/${req.session.language}/translation/common`);

            req.log.error(error);
            res.status(500).render('errors/500', {common: commonContent});
        });
    }
}

module.exports = ActionStepRunner;
