import downloadCheckAnswersPdf from '../../../app/middleware/downloadCheckAnswersPdf.js';
import {expect} from 'chai';
import pdfServices from '../../../app/components/pdf-services.js';
import sinon from 'sinon';

describe('getCheckAnswersPdf', () => {
    describe('createCheckAnswersPdf()', () => {
        let pdfServicesStub;
        let req;
        let res;

        beforeEach(() => {
            pdfServicesStub = sinon.stub(pdfServices, 'createCheckAnswersPdf');
            req = {
                session: {
                    language: 'en',
                    form: sinon.spy()
                },
                log: {
                    error: sinon.spy()
                },
                get: sinon.spy()
            };
            res = {
                render: sinon.spy(),
                setHeader: sinon.spy(),
                send: sinon.spy(),
                status: sinon.spy(),
            };
        });

        afterEach(() => {
            pdfServicesStub.restore();
        });

        it('should return a successful download result', (done) => {
            pdfServicesStub.returns(Promise.resolve('pdf buffer'));
            downloadCheckAnswersPdf(req, res);
            setTimeout(() => {
                expect(res.setHeader.calledTwice).to.equal(true);
                expect(res.setHeader.calledWith('Content-Type', 'application/pdf')).to.equal(true);
                expect(res.setHeader.calledWith('Content-disposition', 'attachment; filename=checkYourAnswers.pdf')).to.equal(true);
                expect(res.send.calledOnce).to.equal(true);
                expect(res.send.calledWith('pdf buffer')).to.equal(true);
                done();
            });
        });

        it('should return an error', (done) => {
            pdfServicesStub.returns(Promise.reject(new Error('error occured')));
            downloadCheckAnswersPdf(req, res);
            setTimeout(() => {
                expect(req.log.error.calledOnce).to.equal(true);
                expect(res.status.calledOnce).to.equal(true);
                expect(res.status.calledWith(500)).to.equal(true);
                expect(res.render.calledOnce).to.equal(true);
                expect(res.render.calledWith('errors/error')).to.equal(true);
                done();
            });
        });
    });
});
