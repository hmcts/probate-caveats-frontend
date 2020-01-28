'use strict';

const co = require('co');
const request = require('supertest');
const a11y = require('test/util/a11y');
const expect = require('chai').expect;
const app = require('app');
const initSteps = require('app/core/initSteps');
const {endsWith} = require('lodash');
const stepsToExclude = ['AddAlias', 'RemoveAlias', 'AddressLookup', 'Summary', 'PaymentBreakdown', 'PaymentStatus'];
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`], 'en');
const config = require('app/config');

Object.keys(steps)
    .filter(stepName => stepsToExclude.includes(stepName))
    .forEach(stepName => delete steps[stepName]);

for (const step in steps) {
    ((step) => {
        const stepUrl = step.constructor.getUrl();
        let results;

        // app.get(step.constructor.getUrl(), step.runner().GET(step));

        describe(`Verify accessibility for the page ${step.name}`, () => {
            let server = null;
            let agent = null;

            before((done) => {
                server = app.init();
                agent = request.agent(server.app);
                co(function* () {
                    let urlSuffix = '';
                    if (endsWith(agent.get(config.app.basePath + step.constructor.getUrl()), '*')) {
                        urlSuffix = '/0';
                    }
                    results = yield a11y(agent.get(config.app.basePath + stepUrl).url + urlSuffix);
                })
                    .then(done, done)
                    .catch((error) => {
                        done(error);
                    });
            });

            after(function (done) {
                server.http.close();
                done();
            });

            it('should not generate any errors', () => {
                const errors = results.issues.filter((res) => res.type === 'error');
                expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
            });

            it('should not generate any warnings', () => {
                const warnings = results.issues.filter((res) => res.type === 'warning');
                expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
            });
        });
    })(steps[step]);
}
