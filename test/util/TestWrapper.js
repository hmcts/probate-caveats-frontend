'use strict';

const {forEach, filter, isEmpty, set, get, cloneDeep} = require('lodash');
const {expect, assert} = require('chai');
const app = require('app');
const routes = require('app/routes');
const config = require('config');
const request = require('supertest');
const journeyMap = require('app/core/journeyMap');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`], 'en');

class TestWrapper {
    constructor(stepName) {
        this.pageToTest = steps[stepName];
        this.pageUrl = this.pageToTest.constructor.getUrl();

        this.content = require(`app/resources/en/translation/${this.pageToTest.resourcePath}`);
        routes.post('/prepare-session/:path', (req, res) => {
            set(req.session, req.params.path, req.body);
            res.send('OK');
        });
        routes.post('/prepare-session-field', (req, res) => {
            Object.assign(req.session, req.body);
            res.send('OK');
        });
        routes.post('/prepare-session-field/:field/:value', (req, res) => {
            set(req.session, req.params.field, req.params.value);
            res.send('OK');
        });

        config.app.useCSRFProtection = 'false';
        this.server = app.init();
        this.agent = request.agent(this.server.app);
    }

    testContent(done, data, excludeKeys = []) {
        const contentToCheck = cloneDeep(filter(this.content, (value, key) => !excludeKeys.includes(key) && key !== 'errors'));
        const substitutedContent = this.substituteContent(data, contentToCheck);
        const res = this.agent.get(this.pageUrl);

        res.expect('Content-type', /html/)
            .then(response => {
                this.assertContentIsPresent(response.text, substitutedContent);
                done();
            })
            .catch(() => done());
    }

    testDataPlayback(done, data = {}, excludeKeys = []) {
        const res = this.agent.get(this.pageUrl);
        const dataToCheck = cloneDeep(filter(data, (value, key) => !excludeKeys.includes(key) && key !== 'errors'));

        res.expect('Content-type', /html/)
            .then(response => {
                this.assertContentIsPresent(response.text, dataToCheck);
                done();
            })
            .catch(() => done());
    }

    testContentNotPresent(done, data) {
        this.agent.get(this.pageUrl)
            .then(response => {
                this.assertContentIsNotPresent(response.text, data);
                done();
            })
            .catch(() => done());
    }

    testErrors(done, data, type, onlyKeys = []) {
        const contentErrors = get(this.content, 'errors', {});
        const expectedErrors = cloneDeep(isEmpty(onlyKeys) ? contentErrors : filter(contentErrors, (value, key) => onlyKeys.includes(key)));
        assert.isNotEmpty(expectedErrors);
        this.substituteErrorsContent(data, expectedErrors, type);
        this.agent.post(this.pageUrl)
            .type('form')
            .send(data)
            .expect('Content-type', 'text/html; charset=utf-8')
            .then(res => {
                forEach(expectedErrors, (value) => {
                    expect(res.text).to.contain(value[type].summary);
                    expect(res.text).to.contain(value[type].message);
                });
                done();
            })
            .catch(() => done());
    }

    testStatus500Page(done, postData) {
        this.agent.post(this.pageUrl)
            .type('form')
            .send(postData)
            .expect(500)
            .then(res => {
                this.assertContentIsPresent(res.text, 'Sorry, we&rsquo;re having technical problems');
                done();
            })
            .catch(() => done());
    }

    testContentAfterError(data, contentToCheck, done) {
        this.agent.post(this.pageUrl)
            .send(data)
            .expect('Content-type', 'text/html; charset=utf-8')
            .then(res => {
                this.assertContentIsPresent(res.text, contentToCheck);
                done();
            })
            .catch(() => done());
    }

    testRedirect(done, data, expectedNextUrl) {
        this.agent.post(this.pageUrl)
            .type('form')
            .send(data)
            .expect('location', expectedNextUrl)
            .expect(302)
            .then(() => done())
            .catch(() => done());
    }

    testGetRedirect(done, postData, expectedNextUrl) {
        this.agent.get(this.pageUrl)
            .type('form')
            .send(postData)
            .expect('location', expectedNextUrl)
            .expect(302)
            .then(() => done())
            .catch(() => done());
    }

    nextStep(data = {}) {
        return journeyMap(this.pageToTest, data);
    }

    substituteContent(data, contentToSubstitute) {
        Object.entries(contentToSubstitute)
            .forEach(([key, contentValue]) => {
                contentValue = contentValue.replace(/\n/g, '<br />\n');
                const contentValueMatch = contentValue.match(/{(.*?)}/g);
                if (contentValueMatch) {
                    contentValueMatch.forEach(placeholder => {
                        if (Array.isArray(data[placeholder])) {
                            data[placeholder].forEach(contentData => {
                                const contentValueReplace = contentValue.replace(placeholder, contentData);
                                contentToSubstitute.push(contentValueReplace);
                            });
                            contentToSubstitute[key] = 'undefined';
                        } else {
                            contentValue = contentValue.replace(placeholder, data[placeholder]);
                            contentToSubstitute[key] = contentValue;
                        }
                    });
                } else {
                    contentToSubstitute[key] = contentValue;
                }
            });
        return contentToSubstitute.filter(content => content !== 'undefined');
    }

    substituteErrorsContent(data, contentToSubstitute, type) {
        Object.entries(contentToSubstitute).forEach(([contentKey, contentValue]) => {
            Object.entries(contentValue[type]).forEach(([errorMessageKey, errorMessageValue]) => {
                const errorMessageValueMatch = errorMessageValue.match(/{(.*?)}/g);
                if (errorMessageValueMatch) {
                    errorMessageValueMatch.forEach(placeholder => {
                        const placeholderRegex = new RegExp(placeholder, 'g');
                        contentToSubstitute[contentKey][type][errorMessageKey] = contentToSubstitute[contentKey][type][errorMessageKey].replace(placeholderRegex, data[placeholder]);
                    });
                }
            });
        });
    }

    assertContentIsPresent(actualContent, expectedContent) {
        expectedContent.forEach(value => {
            expect(actualContent.toLowerCase()).to.contain(value.toString().toLowerCase());
        });
    }

    assertContentIsNotPresent(actualContent, expectedContent) {
        Object.entries(expectedContent).forEach(contentValue => {
            expect(actualContent.toLowerCase()).to.not.contain(contentValue.toString().toLowerCase());
        });
    }

    destroy() {
        this.server.http.close();
    }
}

module.exports = TestWrapper;
