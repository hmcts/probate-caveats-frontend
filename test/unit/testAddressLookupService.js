import {OSPlacesClient} from '@hmcts/os-places-client';
import {assert} from 'chai';
import services from '../../app/components/services.js';
import sinon from 'sinon';
import when from 'when';

const osPlacesClientResponse = {
    valid: true,
    addresses: [{
        formattedAddress: 'MINISTRY OF JUSTICE,SEVENTH FLOOR,103 PETTY FRANCE,LONDON,SW1H 9AJ',
        postcode: 'SW1H 9AJ'
    },
    {
        formattedAddress: 'MINISTRY OF JUSTICE,SEVENTH FLOOR,102 PETTY FRANCE,LONDON,SW1H 9AJ',
        postcode: 'SW1H 9AJ'
    }]
};

const expectedResponse = [{
    formattedAddress: 'MINISTRY OF JUSTICE,SEVENTH FLOOR,103 PETTY FRANCE,LONDON,SW1H 9AJ',
    postcode: 'SW1H 9AJ'
},
{
    formattedAddress: 'MINISTRY OF JUSTICE,SEVENTH FLOOR,102 PETTY FRANCE,LONDON,SW1H 9AJ',
    postcode: 'SW1H 9AJ'
}];

const expectedError = 'Error: Failed to retrieve address list';

describe('addressLookup service tests', function () {
    let lookupByPostcodeStub, findAddressSpy;

    beforeEach(function () {
        findAddressSpy = sinon.spy(services, 'findAddress');
        lookupByPostcodeStub = sinon
            .stub(OSPlacesClient.prototype, 'lookupByPostcode');
    });

    afterEach(function () {
        lookupByPostcodeStub.restore();
        findAddressSpy.restore();
    });

    it('Should successfully retrieve address list with postcode', function (done) {
        lookupByPostcodeStub.returns(when(osPlacesClientResponse));

        services.findAddress('postcode')
            .then(function(actualResponse) {
                sinon.assert.alwaysCalledWith(findAddressSpy, 'postcode');
                assert.strictEqual(JSON.stringify(expectedResponse), JSON.stringify(actualResponse));
                done();
            })
            .catch(done);
    });

    it('Should retrieve an empty list for a non valid response.', function (done) {
        lookupByPostcodeStub.returns(when({valid: false, httpStatus: 200}));

        services.findAddress('postcode')
            .then(function(actualResponse) {
                sinon.assert.alwaysCalledWith(findAddressSpy, 'postcode');
                assert.equal('{}', JSON.stringify(actualResponse));
                done();
            })
            .catch(done);
    });

    it('Should fail to retrieve the address list', function (done) {
        lookupByPostcodeStub.returns(Promise.reject(expectedError));

        services.findAddress('postcode')
            .then(() => {
                done(new Error('Expected method to reject.'));
            })
            .catch((err) => {
                sinon.assert.alwaysCalledWith(findAddressSpy, 'postcode');
                assert.equal(err, expectedError);
                done();
            })
            .catch(done);
    });
});
