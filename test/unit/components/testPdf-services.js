import {expect} from 'chai';
import pdfServices from '../../../app/components/pdf-services.js';
import services from '../../../app/components/services.js';
import sinon from 'sinon';
import utils from '../../../app/components/api-utils.js';

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
