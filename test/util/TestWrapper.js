'use strict';

const {forEach, filter, isEmpty, set, get, cloneDeep} = require('lodash');
const {expect, assert} = require('chai');
const app = require('app');
const routes = require('app/routes');
const config = require('app/config');
const request = require('supertest');
const journeyMap = require('app/core/journeyMap');
const {steps} = require('app/core/initSteps');

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

    testContent(done, excludeKeys = [], data) {
        const contentToCheck = cloneDeep(filter(this.content, (value, key) => !excludeKeys.includes(key) && key !== 'errors'));
        const substitutedContent = this.substituteContent(data, contentToCheck);
        this.agent.get(this.pageUrl)
            .expect('Content-type', /html/)
            .then(response => {
                this.assertContentIsPresent(response.text, substitutedContent);
                done();
            })
            .catch(done);
    }

    testDataPlayback(done, data) {
        this.agent.get(this.pageUrl)
            .expect('Content-type', /html/)
            .then(response => {
                this.assertContentIsPresent(response.text, data);
                done();
            })
            .catch(done);
    }

    testContentNotPresent(done, data) {
        this.agent.get(this.pageUrl)
            .then(response => {
                this.assertContentIsNotPresent(response.text, data);
                done();
            })
            .catch(done);
    }

    testErrors(done, data, type, onlyKeys = []) {
        const contentErrors = get(this.content, 'errors', {});
        const expectedErrors = cloneDeep(isEmpty(onlyKeys) ? contentErrors : filter(contentErrors, (value, key) => onlyKeys.includes(key)));
        assert.isNotEmpty(expectedErrors);
        this.substituteErrorsContent(data, expectedErrors, type);
        this.agent.post(`${this.pageUrl}`)
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
            .catch(done);
    }

    testContentAfterError(data, contentToCheck, done) {
        this.agent.post(this.pageUrl)
            .send(data)
            .expect('Content-type', 'text/html; charset=utf-8')
            .then(res => {
                this.assertContentIsPresent(res.text, contentToCheck);
                done();
            })
            .catch(done);
    }

    testRedirect(done, postData, expectedNextUrl) {
        this.agent.post(this.pageUrl)
            .type('form')
            .send(postData)
            .expect('location', expectedNextUrl)
            .expect(302)
            .then(() => done())
            .catch(done);
    }

    nextStep(data = {}) {
        return journeyMap(this.pageToTest, data);
    }

    substituteContent(data, contentToSubstitute) {
        Object.entries(contentToSubstitute)
            .forEach(([key, contentValue]) => {
                contentValue = contentValue.replace(/\n/g, '<br />\n');
                if (contentValue.match(/\{(.*?)\}/g)) {
                    forEach(contentValue.match(/\{(.*?)\}/g), (placeholder) => {
                        const placeholderRegex = new RegExp(placeholder, 'g');
                        placeholder = placeholder.replace(/[{}]/g, '');
                        if (Array.isArray(data[placeholder])) {
                            forEach(data[placeholder], (contentData) => {
                                const contentValueReplace = contentValue.replace(placeholderRegex, contentData);
                                contentToSubstitute.push(contentValueReplace);
                            });
                            contentToSubstitute[key] = 'undefined';
                        } else {
                            contentValue = contentValue.replace(placeholderRegex, data[placeholder]);
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
        Object.entries(contentToSubstitute)
            .forEach(([key, contentValue]) => {
                forEach(contentValue[type], (errorMessageItem) => {
                    let placeholder = errorMessageItem.match(/\{(.*?)\}/g);
                    if (placeholder) {
                        const placeholderRegex = new RegExp(placeholder, 'g');
                        placeholder = placeholder.replace(/[{}]/g, '');
                        errorMessageItem = errorMessageItem.replace(placeholderRegex, data[placeholder]);
                        contentToSubstitute[key][type] = errorMessageItem;
                    }
                });
            });
    }

    assertContentIsPresent(actualContent, expectedContent) {
        forEach(expectedContent, (value) => {
            expect(actualContent.toLowerCase()).to.contain(value.toString().toLowerCase());
        });
    }

    assertContentIsNotPresent(actualContent, expectedContent) {
        forEach(expectedContent, (value) => {
            expect(actualContent.toLowerCase()).to.not.contain(value.toString().toLowerCase());
        });
    }

    destroy() {
        this.server.http.close();
    }
}

module.exports = TestWrapper;
