'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const FormatUrl = rewire('app/utils/FormatUrl');

describe('FormatUrl.js', () => {
    describe('format()', () => {
        describe('should return the correct url when given a service url', () => {
            it('with a port', (done) => {
                const serviceUrl = FormatUrl.format('http://localhost:8080');
                expect(serviceUrl).to.equal('http://localhost:8080');
                done();
            });

            it('with no port', (done) => {
                const serviceUrl = FormatUrl.format('http://localhost');
                expect(serviceUrl).to.equal('http://localhost');
                done();
            });

            it('with a new path', (done) => {
                const serviceUrl = FormatUrl.format('http://localhost:8080/validate', '/submit');
                expect(serviceUrl).to.equal('http://localhost:8080/submit');
                done();
            });

            it('with the original path', (done) => {
                const serviceUrl = FormatUrl.format('http://localhost:8080/validate');
                expect(serviceUrl).to.equal('http://localhost:8080/validate');
                done();
            });
        });
    });

    describe('createHostname()', () => {
        describe('should return the correct url', () => {
            let req;

            beforeEach(() => {
                req = {
                    host: 'localhost',
                    get: key => req[key]
                };
            });

            it('with http by default when no protocol is given', (done) => {
                const hostname = FormatUrl.createHostname(req);
                expect(hostname).to.equal('http://localhost');
                done();
            });

            it('when an uppercase protocol is given', (done) => {
                FormatUrl.__set__('config', {
                    frontendPublicHttpProtocol: 'HTTPS'
                });
                const hostname = FormatUrl.createHostname(req);
                expect(hostname).to.equal('https://localhost');
                done();
            });
        });
    });
});
