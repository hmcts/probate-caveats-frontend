//module vars
asp_name = "probate-aat"
asp_rg = "probate-aat"
env = "aat"
external_host_name = "probate-caveats.aat.platform.hmcts.net"

//app settings
capacity = "2"
deployment_env = "preprod"

feature_toggles_api_url = "http://rpe-feature-toggle-api-demo.service.core-compute-demo.internal"

idam_service_api = "http://rpe-service-auth-provider-aat.service.core-compute-aat.internal"
idam_user_host = "https://preprod-idamapi.reform.hmcts.net:3511"

packages_environment = "preprod"
packages_version = "3.0.0"

payment_create_url = "http://payment-api-aat.service.core-compute-aat.internal/card-payments"
orchestration_service_url = "https://probate-orchestrator-service-aat.service.core-compute-aat.internal"

probate_deployment_env = "test"

probate_frontend_https = "true"
probate_frontend_port = "3101"
probate_frontend_use_auth = "false"
probate_frontend_use_idam = "false"
probate_frontend_use_redis = "true"

probate_google_track_id = "UA-93598808-1"

probate_private_beta_auth_url = "https://idam.preprod.ccidam.reform.hmcts.net/login"

reform_envirionment_for_test = "aat"

vault_section = "preprod"

//unused?
probate_frontend_hostname = "probate-frontend-aat-staging.service.core-compute-aat.internal"
outbound_proxy = ""
probate_redis_url = "betaPreProdprobatecache01.reform.hmcts.net"
f5_redis_listen_port = "6379"
payment_return_url = "https://probate-frontend-aat-staging.service.core-compute-aat.internal/payment-status"
