
provider "azurerm" {
  version = "1.22.1"
}


locals {
  aseName = "core-compute-${var.env}"
  previewVaultName = "${var.raw_product}-aat"
  nonPreviewVaultName = "${var.raw_product}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"
  localenv = "${(var.env == "preview" || var.env == "spreview") ? "aat": "${var.env}"}"
  //once Backend is up in CNP need to get the
  //localBusinessServiceUrl = "http://probate-business-service-${var.env}.service.${local.aseName}.internal"
  //businessServiceUrl = "${var.env == "preview" ? "http://probate-business-service-aat.service.core-compute-aat.internal" : local.localClaimStoreUrl}"
  // add other services
}

data "azurerm_subnet" "core_infra_redis_subnet" {
  name                 = "core-infra-subnet-1-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
  resource_group_name = "core-infra-${var.env}"
}

module "probate-caveats-fe-redis-cache" {
  source   = "git@github.com:hmcts/moj-module-redis?ref=master"
  product     = "${(var.env == "preview" || var.env == "spreview") ? "${var.product}-${var.microservice}-pr-redis" : "${var.product}-${var.microservice}-redis-cache"}"
  location = "${var.location}"
  env      = "${var.env}"
  subnetid = "${data.azurerm_subnet.core_infra_redis_subnet.id}"
  common_tags  = "${var.common_tags}"
}

data "azurerm_key_vault" "probate_key_vault" {
  name = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}


data "azurerm_key_vault_secret" "probate_postcode_service_token" {
  name = "postcode-service-token"
  vault_uri = "${data.azurerm_key_vault.probate_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "probate_postcode_service_url" {
  name = "postcode-service-url"
  vault_uri = "${data.azurerm_key_vault.probate_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "probate_survey" {
  name = "probate-survey"
  vault_uri = "${data.azurerm_key_vault.probate_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "probate_survey_end" {
  name = "probate-survey-end"
  vault_uri = "${data.azurerm_key_vault.probate_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "probate_application_fee_code" {
  name = "probate-application-fee-code"
  vault_uri = "${data.azurerm_key_vault.probate_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "probate_service_id" {
  name = "probate-service-id"
  vault_uri = "${data.azurerm_key_vault.probate_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "probate_site_id" {
  name = "probate-site-id"
  vault_uri = "${data.azurerm_key_vault.probate_key_vault.vault_uri}"
}


data "azurerm_key_vault_secret" "idam_secret_probate" {
  name = "ccidam-idam-api-secrets-probate"
  vault_uri = "${data.azurerm_key_vault.probate_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "s2s_key" {
  name      = "microservicekey-probate-frontend"
  vault_uri = "https://s2s-${local.localenv}.vault.azure.net/"
}

data "azurerm_key_vault_secret" "caveat_user_name" {
  name      = "caveat-user-name"
  vault_uri = "${data.azurerm_key_vault.probate_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "caveat_user_password" {
  name      = "caveat-user-password"
  vault_uri = "${data.azurerm_key_vault.probate_key_vault.vault_uri}"
}

module "probate-caveats-fe" {
  source = "git@github.com:hmcts/moj-module-webapp.git?ref=master"
  product = "${var.product}-${var.microservice}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"
  is_frontend = "${var.env != "preview" ? 1: 0}"
  subscription = "${var.subscription}"
  asp_name     = "${var.asp_name}"
  additional_host_name = "${var.external_host_name}"  // need to give proper url
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  capacity     = "${var.capacity}"
  common_tags  = "${var.common_tags}"
  asp_rg       = "${var.asp_rg}"

  app_settings = {

    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.product}-${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"

    // Packages
    PACKAGES_NAME="${var.packages_name}"
    PACKAGES_PROJECT="${var.packages_project}"
    PACKAGES_ENVIRONMENT="${var.packages_environment}"
    PACKAGES_VERSION="${var.packages_version}"

    DEPLOYMENT_ENV="${var.deployment_env}"

    // Frontend web details
    PUBLIC_PROTOCOL ="${var.caveat_frontend_protocol}"

    // Service name
    SERVICE_NAME = "${var.frontend_service_name}"

    USE_HTTPS =  "${var.caveat_frontend_https}"
    GA_TRACKING_ID = "${var.caveat_google_track_id}"

    // REDIS
    USE_REDIS = "${var.caveat_frontend_use_redis}"
    REDIS_USE_TLS = "${var.redis_use_tls}"
    REDIS_HOST      = "${module.probate-caveats-fe-redis-cache.host_name}"
    REDIS_PORT      = "${module.probate-caveats-fe-redis-cache.redis_port}"
    REDIS_PASSWORD  = "${module.probate-caveats-fe-redis-cache.access_key}"

    // IDAM
    IDAM_API_URL = "${var.idam_user_host}"
    IDAM_S2S_URL = "${var.idam_service_api}"
    IDAM_SERVICE_KEY = "${data.azurerm_key_vault_secret.s2s_key.value}"
    IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_PROBATE = "${data.azurerm_key_vault_secret.idam_secret_probate.value}"

    //  PAYMENT
    PAYMENT_CREATE_URL = "${var.payment_create_url}"
    ORCHESTRATION_SERVICE_URL = "${var.orchestration_service_url}"

    // POSTCODE
    POSTCODE_SERVICE_URL = "${data.azurerm_key_vault_secret.probate_postcode_service_url.value}"
    POSTCODE_SERVICE_TOKEN = "${data.azurerm_key_vault_secret.probate_postcode_service_token.value}"


    SURVEY = "${data.azurerm_key_vault_secret.probate_survey.value}"
    SURVEY_END_OF_APPLICATION = "${data.azurerm_key_vault_secret.probate_survey_end.value}"
    APPLICATION_FEE_CODE = "${data.azurerm_key_vault_secret.probate_application_fee_code.value}"
    SERVICE_ID = "${data.azurerm_key_vault_secret.probate_service_id.value}"
    SITE_ID = "${data.azurerm_key_vault_secret.probate_site_id.value}"

    CAVEAT_USER_EMAIL = "${data.azurerm_key_vault_secret.caveat_user_name.value}"
    CAVEAT_USER_PASSWORD = "${data.azurerm_key_vault_secret.caveat_user_password.value}"

    REFORM_ENVIRONMENT = "${var.reform_envirionment_for_test}"

    FEATURE_TOGGLES_API_URL = "${var.feature_toggles_api_url}"

    //TESTING = "TESTING"
    // Cache
    WEBSITE_LOCAL_CACHE_OPTION = "${var.website_local_cache_option}"
    WEBSITE_LOCAL_CACHE_SIZEINMB = "${var.website_local_cache_sizeinmb}"

    APP_BASE_PATH = "/caveats"
    POSTCODE_SERVICE_PATH = "/caveats/find-address"
  }
}
