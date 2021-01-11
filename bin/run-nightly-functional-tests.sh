#!/bin/bash
set -ex

TEST_URL='https://probate.aat.platform.hmcts.net/caveats/start-apply'
export TEST_E2E_URL=$(echo ${TEST_URL})

yarn test:nightly