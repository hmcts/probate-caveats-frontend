'use strict';

const expect = require('chai').expect;
const utils = require('app/components/api-utils');
const config = require('config');

describe('api-utils', () => {

    describe('Verify body value within fetchOptions', () => {
        const expectedFetchOptions = {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            follow: 10,
            timeout: config.utils.api.timeout,
            headers: '[object Headers]',
            agent: null,
            body: '{"key":"data"}'
        };

        const data = {
            key: 'data'
        };

        it('test fetchoptions body for a POST method', (done) => {
            const fetchOptions = utils.fetchOptions(data, 'POST', null, null);
            expect(fetchOptions.body).to.equal(expectedFetchOptions.body);
            done();
        });

        it('test fetchoptions body for a GET method', (done) => {
            expectedFetchOptions.body = null;
            const fetchOptions = utils.fetchOptions({}, 'GET', null, null);
            expect(fetchOptions.body).to.equal(expectedFetchOptions.body);
            done();
        });
    });
});
