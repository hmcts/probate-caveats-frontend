'use strict';

class FormatCcdCaseId {
    static format(ccdCase) {
        if (ccdCase && ccdCase.state === 'CaseCreated' && ccdCase.id) {
            const ccdCaseId = ccdCase.id.toString();
            if (!ccdCaseId.includes('-')) {
                return ccdCaseId.match(/.{1,4}/g).join('-');
            }
            return ccdCaseId;
        }
        return '';
    }
}

module.exports = FormatCcdCaseId;
