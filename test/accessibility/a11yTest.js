'use strict';

const co = require('co');
const request = require('supertest');
const a11y = require('test/util/a11y');
const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const {endsWith} = require('lodash');
const commonContent = require('app/resources/en/translation/common');
const stepsToExclude = ['AddAlias', 'RemoveAlias', 'AddressLookup', 'Summary', 'PaymentStatus'];
const app = require('test/accessibility/app').init();
const config = require('app/config');

const steps = initSteps(['../steps/action/', '../steps/ui/']);
Object.keys(steps)
    .filter(stepName => stepsToExclude.includes(stepName))
    .forEach(stepName => delete steps[stepName]);

for (const step in steps) {
    ((step) => {

        let results;

        app.get(step.constructor.getUrl(), step.runner().GET(step));

        describe(`Verify accessibility for the page ${step.name}`, () => {
            let agent = null;
            const title = `${step.content.title} - ${commonContent.serviceName}`
                .replace(/&lsquo;/g, '‘')
                .replace(/&rsquo;/g, '’')
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)');

            before((done) => {

                agent = request(app);
                co(function* () {
                    let urlSuffix = '';
                    if (endsWith(agent.get(config.app.basePath + step.constructor.getUrl()), '*')) {
                        urlSuffix = '/0';
                    }
                    results = yield a11y(agent.get(config.app.basePath + step.constructor.getUrl()).url + urlSuffix, title);
                })
                    .then(done, done)
                    .catch((error) => {
                        done(error);
                    });
            });

            after(function (done) {
                //request.http.close();
                done();
            });

            it('should not generate any errors', () => {
                const errors = results.filter((res) => res.type === 'error');
                expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
            });

            it('should not generate any warnings', () => {
                const warnings = results.filter((res) => res.type === 'warning');
                expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
            });
        });
    })(steps[step]);
}
