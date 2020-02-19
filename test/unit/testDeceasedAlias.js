'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedAlias = steps.DeceasedAlias;

describe('DeceasedAlias', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAlias.constructor.getUrl();
            expect(url).to.equal('/deceased-alias');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedAlias.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'alias',
                    value: 'optionYes',
                    choice: 'assetsInOtherNames'
                }]
            });
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the deceased name', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {
                    deceased: {
                        firstName: 'Jason',
                        lastName: 'Smith'
                    }
                }},
                body: {}
            };
            const ctx = DeceasedAlias.getContextData(req);
            expect(ctx.deceasedName).to.equal('Jason Smith');
            done();
        });
    });

    describe('handlePost()', () => {
        it('should remove otherNames property from ctx', (done) => {
            let ctx = {
                sessionID: 'dummy_sessionId',
                otherNames: 'i exist',
                deceased: {
                    alias: 'optionNo',
                    firstName: 'Jason',
                    lastName: 'Smith'
                },
                session: {form: {}},
                body: {}
            };
            let errors = {};
            expect(ctx.otherNames);
            [ctx, errors] = DeceasedAlias.handlePost(ctx, errors);
            expect(!ctx.otherNames);
            done();
        });
    });
});
