'use strict';

const i18next = require('i18next');
const mapValues = require('lodash').mapValues;

const commonContent = function (language = 'en') {
    i18next.changeLanguage(language);
    const common = require(`app/resources/${language}/translation/common`);
    return mapValues(common, (value, key) => i18next.t(`common.${key}`));
};

module.exports = {
    commonContent
};
