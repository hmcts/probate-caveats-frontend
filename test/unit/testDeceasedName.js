'use strict';

const initSteps = require('app/core/initSteps');
const content = require('app/resources/en/translation/applicant/name.json');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedName = steps.DeceasedName;

describe('DeceasedName', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedName.constructor.getUrl();
            expect(url).to.equal('/deceased-name');
            done();
        });
    });
    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return no the errors', (done) => {
            ctx = {
                firstName: 'firstname',
                lastName: 'lastname'
            };
            errors = [];
            [ctx, errors] = DeceasedName.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                firstName: 'firstname',
                lastName: 'lastname',
            });
            expect(errors).to.deep.equal([]);
            done();
        });

        it('should return the firstname errors correctly', (done) => {
            ctx = {
                firstName: 'http://firstname',
                lastName: 'lastname'
            };
            errors = [];
            [ctx, errors] = DeceasedName.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                firstName: 'http://firstname',
                lastName: 'lastname',
            });
            expect(errors).to.deep.equal([
                {
                    field: 'firstName',
                    href: '#firstName',
                    msg: content.errors.firstName.invalid
                }
            ]);
            done();
        });

        it('should return the lastname errors correctly', (done) => {
            ctx = {
                firstName: 'firstname',
                lastName: 'http://lastname'
            };
            errors = [];
            [ctx, errors] = DeceasedName.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                firstName: 'firstname',
                lastName: 'http://lastname',
            });
            expect(errors).to.deep.equal([
                {
                    field: 'lastName',
                    href: '#lastName',
                    msg: content.errors.lastName.invalid
                }
            ]);
            done();
        });

        it('should return the firstname & lastname errors correctly', (done) => {
            ctx = {
                firstName: 'http://firstname',
                lastName: 'http://lastname'
            };
            errors = [];
            [ctx, errors] = DeceasedName.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                firstName: 'http://firstname',
                lastName: 'http://lastname',
            });
            expect(errors).to.deep.equal([
                {
                    field: 'firstName',
                    href: '#firstName',
                    msg: content.errors.firstName.invalid
                },
                {
                    field: 'lastName',
                    href: '#lastName',
                    msg: content.errors.lastName.invalid
                }
            ]);
            done();
        });
    });
});
