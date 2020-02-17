'use strict';

class Deceased {
    constructor(deceased) {
        this.deceased = deceased || {};
    }

    hasAlias() {
        return this.deceased.alias === 'optionYes';
    }
}

module.exports = Deceased;
