'use strict';

const co = require('co');
const request = require('supertest');
const a11y = require('test/util/a11y');
const expect = require('chai').expect;
const app = require('app');
const initSteps = require('app/core/initSteps');
const {endsWith} = require('lodash');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const stepsToExclude = ['AddAlias', 'RemoveAlias', 'AddressLookup', 'Equality', 'Summary', 'PaymentBreakdown', 'PaymentStatus'];
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`], 'en');
const nock = require('nock');
const config = require('config');
const languages = ['en', 'cy'];

const commonSessionData = {
    form: {
        applicant: {
            firstName: 'Applicant FN',
            lastName: 'Applicant FN'
        },
        language: {
            bilingual: 'Yes'
        }
    },
    back: []
};

Object.keys(steps)
    .filter(stepName => stepsToExclude.includes(stepName))
    .forEach(stepName => delete steps[stepName]);

const runTests = (language ='en') => {
    for (const step in steps) {
        ((step) => {
            const stepUrl = step.constructor.getUrl();
            let results;
            const sessionData = commonSessionData;

            describe(`Verify accessibility for the page ${step.name} - ${language}`, () => {
                const commonContent = language === 'en' ? commonContentEn : commonContentCy;
                let server = null;
                let agent = null;

                const title = `${step.content.title} - ${commonContent.serviceName}`
                    .replace(/&lsquo;/g, '‘')
                    .replace(/&rsquo;/g, '’');
                console.log(title);

                before((done) => {
                    if (step.name === 'ShutterPage' && language === 'en') {
                        server = app.init(true, sessionData, {ft_caveats_shutter: true});
                    } else {
                        server = app.init(true, sessionData);
                    }

                    agent = request.agent(server.app);
                    co(function* () {
                        let urlSuffix = '';
                        if (endsWith(agent.get(config.app.basePath + `${stepUrl}?lng=${language}`), '*')) {
                            urlSuffix = '/0';
                        }
                        results = yield a11y(agent.get(config.app.basePath + `${stepUrl}?lng=${language}`).url + urlSuffix);
                    })
                        .then(done, done)
                        .catch((error) => {
                            done(error);
                        });
                });

                after(function (done) {
                    nock.cleanAll();
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

};

languages.forEach(language => {
    runTests(language);
});
