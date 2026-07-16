'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const config = require('config');
const PostcodeLookup = require('app/services/PostcodeLookup');

const createAxiosError = (status, code) => {
    const error = new Error(`HTTP ${status || 'request error'}`);

    if (status) {
        error.response = {status};
    }

    if (code) {
        error.code = code;
    }

    return error;
};

describe('PostcodeLookup', () => {
    let postcodeLookup;
    let axiosGetStub;

    const samplePostcode = 'SW1A 1AA';

    beforeEach(() => {
        config.services.postcode.url = 'https://api.postcode-service.com';
        config.services.postcode.token = 'mock-token';

        axiosGetStub = sinon.stub(axios, 'get');
        postcodeLookup = new PostcodeLookup();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('get', () => {
        it('should successfully fetch and format postcode addresses', async () => {
            const mockAxiosResponse = {
                data: {
                    results: [
                        {
                            DPA: {
                                ADDRESS: '10 Downing Street, London',
                                POSTCODE: 'SW1A 1AA'
                            }
                        },
                        {
                            DPA: {
                                ADDRESS: '11 Downing Street, London',
                                POSTCODE: 'SW1A 1AA'
                            }
                        }
                    ]
                }
            };

            axiosGetStub.resolves(mockAxiosResponse);

            const result = await postcodeLookup.get(samplePostcode);

            expect(axiosGetStub.calledOnce).to.equal(true);
            expect(axiosGetStub.firstCall.args[0]).to.equal('postcode');
            expect(axiosGetStub.firstCall.args[1]).to.deep.equal({
                baseURL: 'https://api.postcode-service.com',
                headers: {
                    accept: 'application/json'
                },
                params: {
                    key: 'mock-token',
                    lr: 'EN',
                    postcode: samplePostcode
                }
            });

            expect(result).to.deep.equal([
                {
                    formattedAddress: '10 Downing Street, London',
                    postcode: 'SW1A 1AA'
                },
                {
                    formattedAddress: '11 Downing Street, London',
                    postcode: 'SW1A 1AA'
                }
            ]);
        });

        it('should trim the postcode before sending the request', async () => {
            axiosGetStub.resolves({
                data: {
                    results: []
                }
            });

            await postcodeLookup.get(`  ${samplePostcode}  `);

            expect(axiosGetStub.calledOnce).to.equal(true);
            expect(axiosGetStub.firstCall.args[1].params.postcode)
                .to.equal(samplePostcode);
        });

        it('should return an empty array when no results are found', async () => {
            axiosGetStub.resolves({
                data: {}
            });

            const result = await postcodeLookup.get(samplePostcode);

            expect(result).to.deep.equal([]);
        });

        it('should return an empty array when results are null', async () => {
            axiosGetStub.resolves({
                data: {
                    results: null
                }
            });

            const result = await postcodeLookup.get(samplePostcode);

            expect(result).to.deep.equal([]);
        });

        it('should return an empty array without calling the service when no postcode is provided', async () => {
            const result = await postcodeLookup.get();

            expect(result).to.deep.equal([]);
            expect(axiosGetStub.notCalled).to.equal(true);
        });

        it('should return an empty array without calling the service when the postcode is empty', async () => {
            const result = await postcodeLookup.get('');

            expect(result).to.deep.equal([]);
            expect(axiosGetStub.notCalled).to.equal(true);
        });

        it('should return an empty array without calling the service when the postcode contains only whitespace', async () => {
            const result = await postcodeLookup.get('   ');

            expect(result).to.deep.equal([]);
            expect(axiosGetStub.notCalled).to.equal(true);
        });

        it('should return an empty array when the service returns 400', async () => {
            axiosGetStub.rejects(createAxiosError(400));

            const result = await postcodeLookup.get(samplePostcode);

            expect(result).to.deep.equal([]);
        });

        it('should return an empty array when the service returns 404', async () => {
            axiosGetStub.rejects(createAxiosError(404));

            const result = await postcodeLookup.get(samplePostcode);

            expect(result).to.deep.equal([]);
        });

        it('should throw systemError when the token is invalid (401)', async () => {
            axiosGetStub.rejects(createAxiosError(401));

            await expectSystemError(() => postcodeLookup.get(samplePostcode));
        });

        it('should throw systemError when the token is invalid (403)', async () => {
            axiosGetStub.rejects(createAxiosError(403));

            await expectSystemError(() => postcodeLookup.get(samplePostcode));
        });

        it('should throw systemError when the service returns 500', async () => {
            axiosGetStub.rejects(createAxiosError(500));

            await expectSystemError(() => postcodeLookup.get(samplePostcode));
        });

        it('should throw systemError when the service returns 503', async () => {
            axiosGetStub.rejects(createAxiosError(503));

            await expectSystemError(() => postcodeLookup.get(samplePostcode));
        });

        it('should throw systemError when the request times out', async () => {
            axiosGetStub.rejects(
                createAxiosError(null, 'ECONNABORTED')
            );

            await expectSystemError(() => postcodeLookup.get(samplePostcode));
        });

        it('should throw systemError for too many requests error', async () => {
            axiosGetStub.rejects(createAxiosError(429));

            await expectSystemError(() => postcodeLookup.get(samplePostcode));
        });

        it('should throw systemError for a network error without a response', async () => {
            axiosGetStub.rejects(
                createAxiosError(null, 'ECONNRESET')
            );

            await expectSystemError(() => postcodeLookup.get(samplePostcode));
        });
    });

    const expectSystemError = async action => {
        try {
            await action();
            expect.fail('Expected systemError to be thrown');
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('systemError');
        }
    };
});
