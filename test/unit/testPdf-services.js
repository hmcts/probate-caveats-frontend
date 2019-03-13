'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const pdfServices = require('app/components/pdf-services');
const services = require('app/components/services');
const utils = require('app/components/api-utils');

describe('pdf-services', () => {
    describe('createCheckAnswersPdf()', () => {
        let fetchBufferStub;
        let redirect_url;
        let sessionId;
        let formdata;
        let servicesMock;

        beforeEach(() => {
            servicesMock = sinon.mock(services);
            fetchBufferStub = sinon.stub(utils, 'fetchBuffer');
            formdata = {
                checkAnswersSummary: 'values'
            };
            sessionId = 1234;
            redirect_url = 'redirect_url';
        });

        afterEach(() => {
            servicesMock.restore();
            fetchBufferStub.restore();
        });

        it('should call fetchOptions and fetchBuffer if Authorise returns a successful result', (done) => {
            servicesMock.expects('authorise').returns(Promise.resolve('authorised'));
            pdfServices.createCheckAnswersPdf(formdata, redirect_url, sessionId)
                .then((res) => {
                    expect(res).to.equal('pdf buffer');
                    sinon.assert.callCount(fetchBufferStub, 1);
                });
            done();
        });

        it('no fetchBuffer call if Authorise returns an error', (done) => {
            servicesMock.expects('authorise').returns(Promise.reject(new Error('not authorised')));
            fetchBufferStub.returns('pdf buffer');
            pdfServices.createCheckAnswersPdf(formdata, redirect_url, 'sessionId')
                .catch((err) => {
                    expect(err.toLocaleString()).to.equal('not authorised');
                    sinon.assert.callCount(fetchBufferStub, 0);
                });
            done();
        });
    });
});
