import a11y from '../util/a11y.js';
import app from '../../app.js';
import co from 'co';
import commonContentCy from '../../app/resources/cy/translation/common.json' with {type: 'json'};
import commonContentEn from '../../app/resources/en/translation/common.json' with {type: 'json'};
import config from 'config';
import {endsWith} from 'lodash';
import {expect} from 'chai';
import {getTestLanguages} from '../end-to-end/helpers/GeneralHelpers.js';
import initSteps from '../../app/core/initSteps.js';
import nock from 'nock';
import request from 'supertest';

const __dirname = import.meta.dirname;

const stepsToExclude = ['AddAlias', 'RemoveAlias', 'AddressLookup', 'Equality', 'Summary', 'PaymentBreakdown', 'PaymentStatus'];
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`], 'en');

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

getTestLanguages().forEach(language => {
    runTests(language);
});
