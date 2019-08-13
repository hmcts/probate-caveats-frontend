'use strict';

const security = require('app/components/security');
const services = require('app/components/services');

class FeesLookup {

    constructor(applicantId, hostname) {
        this.applicantId = applicantId;
        this.hostname = hostname;
        this.data = {
            applicant_type: 'all',
            channel: 'default',
            event: 'miscellaneous',
            jurisdiction1: 'family',
            jurisdiction2: 'probate registry',
            keyword: 'MNO',
            service: 'probate'
        };
    }

    lookup(authToken) {
        return createCall(this.hostname, this.applicantId, this.data, authToken);
    }
}

async function createCall(hostname, applicantId, data, authToken) {
    const fees = {
        status: 'success',
        total: 0
    };

    await services.feesLookup(data, authToken, applicantId)
        .then(res => {
            if (identifyAnyErrors(res)) {
                fees.status = 'failed';
            } else {
                fees.total = res.fee_amount;
            }
        });
    return fees;
}

/*
 * if no fee_amount is returned, we assume an error has occurred
 * this caters for 404 type messages etc.
 */
function identifyAnyErrors(res) {
    if (res.fee_amount) {
        return false;
    }
    return true;
}

module.exports = FeesLookup;
