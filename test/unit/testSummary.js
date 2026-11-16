'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const Summary = steps.Summary;

describe('Summary', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Summary.constructor.getUrl();
            expect(url).to.equal('/summary');
            done();
        });
    });

    describe('generateFields()', () => {
        it('should propagate isWebChatEnabled from ctx into result', (done) => {
            const language = 'en';
            const ctx = {
                isWebchatEnabled: true,
            };
            const errors = [];
            const formdata = {};

            const result = Summary.generateFields(language, ctx, errors, formdata);

            expect(result).to.contain.keys('isWebchatEnabled');
            done();
        });
    });
});
