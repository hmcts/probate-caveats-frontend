#!/bin/bash
set -ex

if [[ "$TEST_E2E_URL" == "" ]]
then
    TEST_URL='https://probate.aat.platform.hmcts.net'
    export TEST_E2E_URL=$(echo ${TEST_URL})
fi

yarn test:nightly
