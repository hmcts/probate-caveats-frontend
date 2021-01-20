'use strict';

const expect = require('chai').expect;
const healthOptions = require('app/utils/healthOptions');
const config = require('config');

const mockResponse = () => {
    const res = {
        body: {
            status: 'good',
        },
    };
    return res;
};

describe('healthOptions.js', () => {
    it('Should return health options if status is good', (done) => {
        const res = mockResponse();
        const results = healthOptions();
        expect(results.timeout).to.equal(config.health.timeout);
        expect(results.deadline).to.equal(config.health.deadline);
        const healthResponse = results.callback(null, res);
        expect(healthResponse).to.deep.equal({status: 'UP'});
        done();
    });

    it('Should return health options DOWN if status is error', (done) => {
        const res = mockResponse();
        res.body.status = 'not good';
        const results = healthOptions();
        expect(results.timeout).to.equal(config.health.timeout);
        expect(results.deadline).to.equal(config.health.deadline);
        const healthResponse = results.callback(new Error('error'), res);
        expect(healthResponse).to.deep.equal({status: 'DOWN'});
        done();
    });
});
