'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const config = require('config');
const PostcodeLookup = require('app/services/PostcodeLookup');

describe('PostcodeLookup', () => {
    let postcodeLookup;
    let axiosGetStub;

    beforeEach(() => {
        config.services.postcode.url= 'https://api.postcode-service.com';
        config.services.postcode.token = 'mock-token';
        axiosGetStub = sinon.stub(axios, 'get');
        postcodeLookup = new PostcodeLookup();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('get', () => {
        const samplePostcode = 'SW1A 1AA';

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

            // Assert axios call structure
            expect(axiosGetStub.calledOnce).to.equal(true);
            expect(axiosGetStub.firstCall.args[0]).to.equal('postcode');
            expect(axiosGetStub.firstCall.args[1]).to.deep.equal({
                baseURL: 'https://api.postcode-service.com',
                headers: {accept: 'application/json'},
                params: {
                    key: 'mock-token',
                    lr: 'EN',
                    postcode: samplePostcode
                }
            });
            expect(result).to.have.lengthOf(2);
            expect(result[0]).to.deep.equal({
                formattedAddress: '10 Downing Street, London',
                postcode: 'SW1A 1AA'
            });
        });

        it('should return an empty array if no results are found in the response data', async () => {
            const mockAxiosResponse = {data: {}}; // No results key
            axiosGetStub.resolves(mockAxiosResponse);

            const result = await postcodeLookup.get(samplePostcode);
            expect(result).to.be.an('array').and.have.lengthOf(0);
        });

        it('throws a systemError when the token is invalid (401)', async () => {
            const mockErrorResponse = {status: 401};
            axiosGetStub.rejects(mockErrorResponse);
            try {
                await postcodeLookup.get('SW1A');
                expect.fail('Expected error to be thrown');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal('systemError');
            }
        });

        it('should throw systemError when service returns 500', async () => {
            const mockErrorResponse = {status: 500};
            axiosGetStub.rejects(mockErrorResponse);
            try {
                await postcodeLookup.get('SW1A');
                expect.fail('Expected error to be thrown');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal('systemError');
            }
        });

        it('should throw systemError when service returns 503', async () => {
            const mockErrorResponse = {status: 503};
            axiosGetStub.rejects(mockErrorResponse);
            try {
                await postcodeLookup.get('SW1A');
                expect.fail('Expected error to be thrown');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal('systemError');
            }
        });

        it('should throw systemError on timeout', async () => {
            const mockErrorResponse = {code: 'ECONNABORTED'};
            axiosGetStub.rejects(mockErrorResponse);
            try {
                await postcodeLookup.get('SW1A');
                expect.fail('Expected error to be thrown');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal('systemError');
            }
        });

        it('should throw systemError when service returns 400', async () => {
            const mockErrorResponse = {status: 400};
            axiosGetStub.rejects(mockErrorResponse);
            try {
                await postcodeLookup.get('SW1A');
                expect.fail('Expected error to be thrown');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal('systemError');
            }
        });

    });
});
