'use strict';

const {sanitizeInput} = require('../../../app/utils/Sanitize');
const {expect} = require('chai');
describe('Sanitize.sanitizeInput', () => {
    it('should remove dangerous keys from the input object', () => {
        const input = {
            name: 'John',
            __proto__: 'malicious',
            constructor: 'malicious',
            prototype: 'malicious'
        };
        const sanitized = sanitizeInput(input);

        expect(sanitized).to.deep.equal({name: 'John'});
        // eslint-disable-next-line no-proto,no-unused-expressions
        expect(Object.prototype.hasOwnProperty.call(sanitized, '__proto__')).to.be.false;
    });

    it('should retain safe keys in the input object', () => {
        const input = {
            name: 'Jane',
            age: 30
        };
        const sanitized = sanitizeInput(input);

        expect(sanitized).to.deep.equal({name: 'Jane', age: 30});
    });

    it('should handle empty input objects', () => {
        const input = {};
        const sanitized = sanitizeInput(input);

        expect(sanitized).to.deep.equal({});
    });
});
