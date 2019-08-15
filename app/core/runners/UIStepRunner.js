'use strict';

const co = require('co');
const {curry, set, isEmpty, forEach} = require('lodash');
const mapErrorsToFields = require('app/components/error').mapErrorsToFields;
const FormatUrl = require('app/utils/FormatUrl');

class UIStepRunner {

    constructor() {
        this.GET = curry(this.handleGet);
        this.POST = curry(this.handlePost);
    }

    handleGet(step, req, res) {
        return co(function * () {
            let errors = null;
            const session = req.session;
            const formdata = session.form;
            let ctx = step.getContextData(req);
            const featureToggles = session.featureToggles;
            [ctx, errors] = yield step.handleGet(ctx, formdata, featureToggles);
            forEach(errors, (error) =>
                req.log.info({type: 'Validation Message', url: step.constructor.getUrl()}, JSON.stringify(error))
            );
            const content = step.generateContent(ctx, formdata);
            const fields = step.generateFields(ctx, errors, formdata);
            if (req.query.source === 'back') {
                session.back.pop();
            } else if (session.back[session.back.length - 1] !== step.constructor.getUrl()) {
                session.back.push(step.constructor.getUrl());
            }
            const common = step.commonContent();
            res.render(step.template, {content, fields, errors, common}, (err, html) => {
                if (err) {
                    req.log.error(err);
                    return res.status(500).render('errors/500');
                }
                step.renderPage(res, html);

            });
        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/500');
        });
    }

    handlePost(step, req, res) {
        return co(function * () {
            const session = req.session;
            let formdata = session.form;
            let ctx = step.getContextData(req, res);
            let [isValid, errors] = [];
            const hostname = FormatUrl.createHostname(req);
            [isValid, errors] = step.validate(ctx, formdata);
            const featureToggles = session.featureToggles;
            if (isValid) {
                [ctx, errors] = yield step.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
            }

            if (isEmpty(errors)) {
                const nextStepUrl = step.nextStepUrl(req, ctx);
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
                const content = step.generateContent(ctx, formdata);
                let fields = step.generateFields(ctx, errors, formdata);
                fields = mapErrorsToFields(fields, errors);
                const common = step.commonContent();
                res.render(step.template, {content, fields, errors, common});
            }
        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/500');
        });
    }
}

module.exports = UIStepRunner;
