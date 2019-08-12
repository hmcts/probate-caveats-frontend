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

    async lookup() {
        const authToken = await security.getUserToken(this.hostname, this.applicantId);
        return services.feesLookup(this.data, authToken, this.applicantId);
    }
}

module.exports = FeesLookup;
