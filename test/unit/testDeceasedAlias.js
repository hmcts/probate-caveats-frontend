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

    describe('action()', () => {
        it('removes the correct values from the context when the deceased has an alias', (done) => {
            let formdata = {};
            let ctx = {
                alias: 'optionYes',
                otherNames: {
                    name_0: {firstName: 'FN1', lastName: 'LN1'},
                    name_1: {firstName: 'FN2', lastName: 'LN2'}
                }
            };
            [ctx, formdata] = DeceasedAlias.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                alias: 'optionYes',
                otherNames: {
                    name_0: {firstName: 'FN1', lastName: 'LN1'},
                    name_1: {firstName: 'FN2', lastName: 'LN2'}
                }
            });
            done();
        });

        it('removes the correct values from the context when the deceased has no alias', (done) => {
            let formdata = {};
            let ctx = {
                alias: 'optionNo',
                otherNames: {
                    name_0: {firstName: 'FN1', lastName: 'LN1'},
                    name_1: {firstName: 'FN2', lastName: 'LN2'}
                }
            };
            [ctx, formdata] = DeceasedAlias.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                alias: 'optionNo'
            });
            done();
        });
    });
});
