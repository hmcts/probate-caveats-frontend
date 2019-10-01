'use strict';

const sanitizeRequestBody = require('app/middleware/sanitizeRequestBody');
const {assert} = require('chai');
const sinon = require('sinon');

describe('SanitizeRequestBody', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        res = {};
        req = {
            body: {
                name: ''
            }
        };
        next = sinon.spy();
    });

    describe('sanitizeRequestBody()', () => {

        it('should ignore empty', function() {
            sanitizeRequestBody(req, res, next);
            assert.equal('', req.body.name);
        });

        it('should ignore simple text', function() {
            req.body.name= 'hello world';
            sanitizeRequestBody(req, res, next);
            assert.equal('hello world', req.body.name);
        });

        it('should remove open tag', function() {
            req.body.name= '<hello world';
            sanitizeRequestBody(req, res, next);
            assert.equal('', req.body.name);
        });

        it('should remove closed tag', function() {
            req.body.name= 'hello<script/> world';
            sanitizeRequestBody(req, res, next);
            assert.equal('hello world', req.body.name);
        });

        it('should remove tag and its content', function() {
            req.body.name= 'hello<script>alert("hello again!");</script> world';
            sanitizeRequestBody(req, res, next);
            assert.equal('hello world', req.body.name);
        });

        it('should ignore close tag', function() {
            req.body.name= '>hello world';
            sanitizeRequestBody(req, res, next);
            assert.equal('>hello world', req.body.name);
        });

        it('should ignore close tag', function() {
            req.body.name= 'hello world>';
            sanitizeRequestBody(req, res, next);
            assert.equal('hello world>', req.body.name);
        });

        it('should ignore non string field', function() {
            req.body.name= 'hello world';
            req.body.number = 123456789;
            sanitizeRequestBody(req, res, next);
            assert.equal('hello world', req.body.name);
            assert.equal(123456789, req.body.number);
        });

        it('should ignore close tag', function() {
            req.body.name= 'hello world>';
            sanitizeRequestBody(req, res, next);
            assert.equal('hello world>', req.body.name);
        });
    });
});
