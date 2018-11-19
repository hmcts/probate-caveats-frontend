'use strict';

const i18next = require('i18next');
const mapValues = require('lodash').mapValues;

const commonContent = function (lang = 'en') {
    i18next.changeLanguage(lang);
    const common = require('app/resources/en/translation/common');
    return mapValues(common, (value, key) => i18next.t(`common.${key}`));
};

module.exports = {
    commonContent
};
