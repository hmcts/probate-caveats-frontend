'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const pdfServices = require('app/components/pdf-services');
const services = require('app/components/services');
const utils = require('app/components/api-utils');

describe('pdf-services', () => {
    describe('createCheckAnswersPdf()', () => {
        let authoriseStub;
        let fetchBufferStub;
        let formdata;

        beforeEach(() => {
            authoriseStub = sinon.stub(services, 'authorise');
            fetchBufferStub = sinon.stub(utils, 'fetchBuffer');
            formdata = {
                checkAnswersSummary: 'values'
            };
        });

        afterEach(() => {
            authoriseStub.restore();
            fetchBufferStub.restore();
        });

        it('should call fetchOptions and fetchBuffer if Authorise returns a successful result', (done) => {
            authoriseStub.returns(Promise.resolve('serviceToken'));
            fetchBufferStub.returns('pdf buffer');

            pdfServices.createCheckAnswersPdf(formdata, 'seesionId')
                .then((res) => {
                    expect(res).to.equal('pdf buffer');
                    sinon.assert.callCount(fetchBufferStub, 1);
                    done();
                });
        });

        it('no fetchBuffer call if Authorise returns an error', (done) => {
            authoriseStub.returns(Promise.reject(new Error('not authorised')));
            fetchBufferStub.returns('pdf buffer');
            pdfServices.createCheckAnswersPdf(formdata, 'seesionId')
                .catch((err) => {
                    expect(err).to.equal('not authorised');
                    sinon.assert.callCount(fetchBufferStub, 0);
                    done();
                });
        });
    });
});
