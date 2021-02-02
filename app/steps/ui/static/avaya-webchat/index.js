'use strict';

const Step = require('app/core/steps/Step');

class AvayaWebchat extends Step {

    static getUrl () {
        return '/avaya-webchat';
    }
}

module.exports = AvayaWebchat;
