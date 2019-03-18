// Module vars
asp_name = "probate-demo"
asp_rg = "probate-demo"
env = "demo"
external_host_name = "probate-caveats.demo.platform.hmcts.net"

// app settings vars
deployment_env = "preprod"

feature_toggles_api_url = "http://rpe-feature-toggle-api-demo.service.core-compute-demo.internal"

idam_service_api = "http://rpe-service-auth-provider-demo.service.core-compute-demo.internal"
idam_user_host = "https://preprod-idamapi.reform.hmcts.net:3511"

packages_environment = "preprod"
packages_version = "3.0.0"

probate_deployment_env = "test"

probate_frontend_https = "true"
probate_frontend_use_auth = "false"
probate_frontend_port = "3101"
probate_frontend_use_idam = "true"
probate_frontend_use_redis = "true"

probate_google_track_id = "UA-93598808-1"
probate_private_beta_auth_url = "https://idam.preprod.ccidam.reform.hmcts.net/login"

payment_create_url = "https://preprod.payments.reform.hmcts.net:4401/users/userId/payments"
orchestration_service_url = "http://probate-orchestrator-service-demo.service.core-compute-demo.internal"

reform_envirionment_for_test = "demo"

vault_section = "preprod"

//unused vars?
probate_frontend_hostname = "probate-frontend-demo.service.core-compute-demo.internal"
outbound_proxy = ""
probate_redis_url = "betaPreProdprobatecache01.reform.hmcts.net"
f5_redis_listen_port = "6379"
payment_return_url = "https://probate-frontend-demo.service.core-compute-demo.internal/payment-status"
