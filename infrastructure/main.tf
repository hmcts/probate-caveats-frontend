provider "azurerm" {
  features {}
}

locals {
  vaultName = "${var.product}-${var.env}"
}

module "probate-caveats-fe-redis-cache" {
  source   = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product     = "${var.product}-${var.component}-redis-cache"
  location = var.location
  env      = var.env
  common_tags  = var.common_tags
  private_endpoint_enabled = true
    redis_version = "6"
    business_area = "cft"
    public_network_access_enabled = false
}

data "azurerm_key_vault" "probate_key_vault" {
  name = local.vaultName
  resource_group_name = local.vaultName
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "${var.component}-redis-access-key"
  value        = module.probate-caveats-fe-redis-cache.access_key
  key_vault_id = data.azurerm_key_vault.probate_key_vault.id
}

data "azurerm_key_vault" "s2s_vault" {
  name = "s2s-${var.env}"
  resource_group_name = "rpe-service-auth-provider-${var.env}"
}

data "azurerm_key_vault_secret" "probate_frontend_s2s_secret" {
  name = "microservicekey-probate-frontend"
  key_vault_id = data.azurerm_key_vault.s2s_vault.id
}

resource "azurerm_key_vault_secret" "s2s_key" {
  name = "idam-s2s-secret"
  value = data.azurerm_key_vault_secret.probate_frontend_s2s_secret.value
  key_vault_id = data.azurerm_key_vault.probate_key_vault.id
}
