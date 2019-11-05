'use strict';

const co = require('co');
const {curry, set, isEmpty, forEach} = require('lodash');
const FormatUrl = require('app/utils/FormatUrl');

class UIStepRunner {

    constructor() {
        this.GET = curry(this.handleGet);
        this.POST = curry(this.handlePost);
    }

    handleGet(step, req, res) {
        let errors = null;
        const session = req.session;
        const formdata = session.form;
        const commonContent = require(`app/resources/${session.language}/translation/common`);

        return co(function * () {
            let ctx = step.getContextData(req);
            [ctx, errors] = yield step.handleGet(ctx, formdata, session.language);
            forEach(errors, (error) =>
                req.log.info({type: 'Validation Message', url: step.constructor.getUrl()}, JSON.stringify(error))
            );
            const content = step.generateContent(ctx, formdata, session.language);
            const fields = step.generateFields(session.language, ctx, errors, formdata);
            if (req.query.source === 'back') {
                session.back.pop();
            } else if (session.back[session.back.length - 1] !== step.constructor.getUrl()) {
                session.back.push(step.constructor.getUrl());
            }
            const common = step.commonContent(session.language);
            res.render(step.template, {content, fields, errors, common}, (err, html) => {
                if (err) {
                    req.log.error(err);
                    return res.status(500).render('errors/500', {common: commonContent});
                }
                step.renderPage(res, html);

            });
        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/500', {common: commonContent});
        });
    }

    handlePost(step, req, res) {
        const session = req.session;
        let formdata = session.form;
        const commonContent = require(`app/resources/${session.language}/translation/common`);

        return co(function * () {
            let ctx = step.getContextData(req);
            let [isValid, errors] = [];
            const hostname = FormatUrl.createHostname(req);
            [isValid, errors] = step.validate(ctx, formdata, session.language);
            if (isValid) {
                [ctx, errors] = yield step.handlePost(ctx, errors, formdata, session, hostname);
            }

            if (isEmpty(errors)) {
                const nextStepUrl = step.nextStepUrl(ctx);
                [ctx, formdata] = step.action(ctx, formdata);

                set(formdata, step.section, ctx);

                if (session.back[session.back.length - 1] !== step.constructor.getUrl()) {
                    session.back.push(step.constructor.getUrl());
                }

                res.redirect(nextStepUrl);
            } else {
                forEach(errors, (error) =>
                    req.log.info({type: 'Validation Message', url: step.constructor.getUrl()}, JSON.stringify(error))
                );
                const content = step.generateContent(ctx, formdata, session.language);
                const fields = step.generateFields(session.language, ctx, errors, formdata);
                const common = step.commonContent(session.language);
                res.render(step.template, {content, fields, errors, common});
            }
        }).catch((error) => {
            req.log.error(error);
            const ctx = step.getContextData(req, res);
            const fields = step.generateFields(req.session.language, ctx, [], {});
            res.status(500).render('errors/500', {fields, common: commonContent});
        });
    }
}

module.exports = UIStepRunner;
