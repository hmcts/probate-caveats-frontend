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
idam_user_host = "https://idam-api.aat.platform.hmcts.net"
payment_create_url = "http://payment-api-aat.service.core-compute-aat.internal/card-payments"
orchestration_service_url = "http://probate-orchestrator-service-aat.service.core-compute-aat.internal"

packages_environment = "preprod"
packages_version = "3.0.0"

caveat_frontend_https = "false"
caveat_frontend_use_redis = "true"

caveat_google_track_id = "UA-93598808-5"

reform_envirionment_for_test = "aat"

vault_section = "preprod"

//unused?
outbound_proxy = ""
probate_redis_url = "betaPreProdprobatecache01.reform.hmcts.net"
f5_redis_listen_port = "6379"
