const Step = require('app/core/steps/Step');

class StartApply extends Step {

    static getUrl () {
        return '/start-apply';
    }
}

module.exports = StartApply;
