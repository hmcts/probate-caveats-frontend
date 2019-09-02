'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('AddAlias', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

    describe('handlePost', () => {
        it('Adds other names to formdata', (done) => {
            let ctx = {
                otherNames: {
                    name_0: {
                        firstName: 'alias1',
                        lastName: 'one'
                    },
                    name_1: {
                        firstName: 'alias2',
                        lastName: 'two'
                    }
                }
            };
            let errors = {};
            const formdata = {};
            const AddAlias = steps.AddAlias;

            [ctx, errors] = AddAlias.handlePost(ctx, errors, formdata);
            assert.exists(formdata.deceased.otherNames);
            done();
        });
    });
});
