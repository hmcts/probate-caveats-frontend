'use strict';

const logger = require('app/components/logger');
const FeatureToggleService = require('app/services/FeatureToggle');
const config = require('config');
const featureToggles = config.featureToggles;

class FeatureToggle {
    callCheckToggle(req, res, next, featureToggleKey, callback, redirectPage) {
        return this.checkToggle({
            req,
            res,
            next,
            featureToggleKey,
            callback,
            redirectPage
        });
    }

    checkToggle(params) {
        const featureToggleKey = params.featureToggleKey;
        const sessionId = params.req.session.id;
        const featureToggle = new FeatureToggleService(config.featureToggles.url, params.req.sessionID);
        return featureToggle.get(featureToggles[featureToggleKey])
            .then(isEnabled => {
                logger(sessionId).info(`Checking feature toggle: ${featureToggleKey}, isEnabled: ${isEnabled}`);
                params.callback({
                    req: params.req,
                    res: params.res,
                    next: params.next,
                    redirectPage: params.redirectPage,
                    isEnabled: isEnabled === 'true',
                    featureToggleKey: featureToggleKey
                });
            })
            .catch(err => {
                params.next(err);
            });
    }

    togglePage(params) {
        if (params.isEnabled) {
            params.next();
        } else {
            params.res.redirect(params.redirectPage);
        }
    }

    toggleExistingPage(params) {
        if (params.isEnabled) {
            params.res.redirect(params.redirectPage);
        } else {
            params.next();
        }
    }

    toggleFeature(params) {
        if (!params.req.session.featureToggles) {
            params.req.session.featureToggles = {};
        }
        params.req.session.featureToggles[params.featureToggleKey] = params.isEnabled;
        params.next();
    }

    static appwideToggles(req, ctx, appwideToggles) {
        if (appwideToggles.length) {
            ctx.featureToggles = {};
            appwideToggles.forEach((toggleKey) => {
                ctx.featureToggles[toggleKey] = FeatureToggle.isEnabled(req.session.featureToggles, toggleKey).toString();
            });
        }

        return ctx;
    }

    static isEnabled(featureToggles, key) {
        if (featureToggles && featureToggles[key]) {
            return true;
        }
        return false;
    }
}

module.exports = FeatureToggle;
