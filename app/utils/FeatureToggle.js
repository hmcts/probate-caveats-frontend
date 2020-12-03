'use strict';

const logger = require('app/components/logger');
const config = require('config');
const LaunchDarkly = require('app/components/launch-darkly');

class FeatureToggle {
    constructor() {
        this.launchDarkly = new LaunchDarkly().getInstance();
    }

    callCheckToggle(req, res, next, launchDarkly, featureToggleKey, callback, redirectPage) {
        return this.checkToggle({
            req,
            res,
            next,
            launchDarkly,
            featureToggleKey,
            callback,
            redirectPage
        });
    }

    checkToggle(params) {
        const featureToggleKey = config.featureToggles[params.featureToggleKey];
        const ldUser = config.featureToggles.launchDarklyUser;
        const sessionId = params.req.session.id;

        let ldDefaultValue = false;

        if (params.launchDarkly.ftValue && params.launchDarkly.ftValue[params.featureToggleKey]) {
            ldDefaultValue = params.launchDarkly.ftValue[params.featureToggleKey];
        }

        try {
            this.launchDarkly.variation(featureToggleKey, ldUser, ldDefaultValue, (err, showFeature) => {
                if (err) {
                    params.next();
                } else {
                    logger(sessionId).info(`Checking feature toggle: ${params.featureToggleKey}, isEnabled: ${showFeature}`);
                    params.callback({
                        req: params.req,
                        res: params.res,
                        next: params.next,
                        redirectPage: params.redirectPage,
                        isEnabled: showFeature,
                        featureToggleKey: params.featureToggleKey
                    });
                }
            });
        } catch (err) {
            params.next();
        }
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
