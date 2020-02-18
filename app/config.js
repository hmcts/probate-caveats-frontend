'use strict';

module.exports = {
    frontendPublicHttpProtocol: process.env.PUBLIC_PROTOCOL || 'http',
    environment: process.env.REFORM_ENVIRONMENT || 'prod',
    nodeEnvironment: process.env.NODE_ENV,
    gitRevision: process.env.GIT_REVISION,
    externalHostNameUrl: process.env.EXTERNAL_HOSTNAME_URL || '',
    languages: ['en', 'cy'],
    featureToggles: {
        url: process.env.FEATURE_TOGGLES_API_URL || 'http://localhost:8292',
        path: process.env.FEATURE_TOGGLES_PATH || '/api/ff4j/check',
        port: 8292,
        caveats_shutter_toggle: 'probate-caveats-fe-shutter',
        appwideToggles: []
    },
    app: {
        useHttps: process.env.USE_HTTPS || 'false',
        port: process.env.PORT || '3000',
        useCSRFProtection: 'true',
        basePath: process.env.APP_BASE_PATH || ''
    },
    services: {
        postcode: {
            token: process.env.POSTCODE_SERVICE_TOKEN
        },
        orchestration: {
            url: process.env.ORCHESTRATION_SERVICE_URL || 'http://localhost:8888',
            port: 8888,
            paths: {
                checkanswerspdf: 'documents/generate/checkAnswersSummary',
                payment_updates: '/payment-updates'
            }
        },
        idam: {
            apiUrl: process.env.IDAM_API_URL || 'http://localhost:4501',
            roles: ['probate-private-beta', 'citizen'],
            s2s_url: process.env.IDAM_S2S_URL || 'http://localhost:4502',
            service_name: 'probate_frontend',
            service_key: process.env.IDAM_SERVICE_KEY || 'AAAAAAAAAAAAAAAA',
            probate_oauth2_client: 'probate',
            probate_oauth2_secret: process.env.IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_PROBATE || '123456',
            caveat_user_email: process.env.CAVEAT_USER_EMAIL || 'testusername1@test.com',
            caveat_user_password: process.env.CAVEAT_USER_PASSWORD || 'password',
            caveat_redirect_base_url: process.env.CAVEAT_REDIRECT_BASE_URL || 'http://localhost:3000',
            caveat_redirectUrl: '/oauth2/callback'
        },
        payment: {
            createPaymentUrl: process.env.PAYMENT_CREATE_URL || 'http://localhost:8383/card-payments',
            authorization: process.env.PAYMENT_AUTHORIZATION || 'dummy_token',
            serviceAuthorization: process.env.PAYMENT_SERVICE_AUTHORIZATION || 'dummy_token',
            userId: process.env.PAYMENT_USER_ID || 999999999,
            returnUrlPath: process.env.PAY_RETURN_URL || '/payment-status'
        },
        persistence: {
            url: process.env.PERSISTENCE_SERVICE_URL || 'http://localhost:8282/formdata',
            port: 8282,
            path: '/formdata'
        },
        feesRegister: {
            url: process.env.FEES_REGISTRY_URL || 'http://localhost:4411/fees-register',
            port: 4411,
            paths: {
                fees: '/fees',
                feesLookup: '/fees/lookup'
            },
            ihtMinAmt: 5000,
            feesData: {
                applicant_type: 'all',
                channel: 'default',
                event: 'miscellaneous',
                jurisdiction1: 'family',
                jurisdiction2: 'probate registry',
                keyword: 'Caveat',
                service: 'probate'
            }
        }
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || 'dummy_password',
        useTLS: process.env.REDIS_USE_TLS || 'false',
        enabled: process.env.USE_REDIS || 'false',
        secret: process.env.REDIS_SECRET || 'OVERWRITE_THIS',
        proxy: true,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: 'lax'
        }
    },
    dateFormat: 'DD/MM/YYYY',
    payloadVersion: '4.1.0',
    hostname: process.env.FRONTEND_HOSTNAME || 'localhost:3000',
    gaTrackingId: process.env.GA_TRACKING_ID || 'UA-93598808-5',
    enableTracking: process.env.ENABLE_TRACKING || 'true',
    webChat: {
        chatId: process.env.WEBCHAT_CHAT_ID || '3077733355d19fd430f23c7.02555395',
        tenant: process.env.WEBCHAT_TENANT || 'c2FuZGJveGhtY3RzMDE',
        buttonNoAgents: process.env.WEBCHAT_BUTTON_NO_AGENTS || '20599210435d19f59cdc3e95.94551214',
        buttonAgentsBusy: process.env.WEBCHAT_BUTTON_AGENTS_BUSY || '8752254635d19f5bb21ff07.71234899',
        buttonServiceClosed: process.env.WEBCHAT_BUTTON_SERVICE_CLOSED || '4639879315d19f67c3c1055.15174024',
    },
    links: {
        accessibility: (process.env.APP_BASE_PATH || '') + '/accessibility-statement',
        cookies: (process.env.APP_BASE_PATH || '') + '/cookies',
        privacy: (process.env.APP_BASE_PATH || '') + '/privacy-policy',
        terms: (process.env.APP_BASE_PATH || '') + '/terms-conditions',
        contact: (process.env.APP_BASE_PATH || '') + '/contact-us',
        callCharges: 'https://www.gov.uk/call-charges',
        howToManageCookies: 'https://www.aboutcookies.org',
        googlePrivacyPolicy: 'https://www.google.com/policies/privacy/partners/',
        googleAnalyticsOptOut: 'https://tools.google.com/dlpage/gaoptout/',
        mojPersonalInformationCharter: 'https://www.gov.uk/government/organisations/ministry-of-justice/about/personal-information-charter',
        survey: process.env.SURVEY || 'https://www.smartsurvey.co.uk/s/Probate_Feedback/',
        surveyEndOfApplication: process.env.SURVEY_END_OF_APPLICATION || 'https://www.smartsurvey.co.uk/s/Probate_ExitSurvey/',
        applicationFormPA8A: 'https://www.gov.uk/government/publications/form-pa8a-caveat-application-form',
        whoInheritsLink: 'https://www.gov.uk/inherits-someone-dies-without-will',
        citizenAdvice: 'https://www.citizensadvice.org.uk/',
        stopGrantOfRepresentation: 'https://www.gov.uk/wills-probate-inheritance/stopping-a-grant-of-representation',
        goodThingsFoundation: 'https://www.goodthingsfoundation.org',
        subjectAccessRequest: 'https://www.gov.uk/government/publications/request-your-personal-data-from-moj',
        complaintsProcedure: 'https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service/about/complaints-procedure',
        informationCommissionersOffice: 'https://ico.org.uk/global/contact-us',
        applicationFormPA15: 'https://www.gov.uk/government/publications/form-pa15-apply-for-renunciation-will',
        deathReportedToCoroner: 'https://www.gov.uk/after-a-death/when-a-death-is-reported-to-a-coroner',
        myAbilityLink: 'https://mcmw.abilitynet.org.uk/',
        equalityAdvisorLink: 'https://www.equalityadvisoryservice.com/',
        wcag21Link: 'https://www.w3.org/TR/WCAG21/'
    },
    utils: {
        api: {
            retries: process.env.RETRIES_NUMBER || 10,
            retryDelay: process.env.RETRY_DELAY || 1000,
            timeout: 30000
        }
    },
    payment: {
        applicationFee: 20,
        applicationFeeThreshold: 5000,
        applicationFeeCode: process.env.APPLICATION_FEE_CODE || 'FEE0288',
        serviceId: process.env.SERVICE_ID || 'PROBATE',
        siteId: process.env.SITE_ID || 'P223',
        version: process.env.version || '1',
        currency: process.env.currency || 'GBP'
    },
    livenessEndpoint: '/health/liveness',
    healthEndpoint: '/health',
    appInsights: {
        instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATION_KEY
    },
    whitelistedPagesForStartApplyPageRedirect: [
        '/public',
        '/start-apply',
        '/bilingual-gop',
        '/applicant-name',
        '/accessibility-statement',
        '/cookies',
        '/privacy-policy',
        '/terms-conditions',
        '/contact-us',
        '/offline',
        '/health/liveness'
    ],
    whiteListedPagesForThankyou: [
        '/public',
        '/accessibility-statement',
        '/cookies',
        '/privacy-policy',
        '/terms-conditions',
        '/contact-us',
        '/offline',
        '/health/liveness',
        '/thank-you'
    ],
    whiteListedPagesForPaymentBreakdown: [
        '/public',
        '/accessibility-statement',
        '/cookies',
        '/privacy-policy',
        '/terms-conditions',
        '/contact-us',
        '/offline',
        '/health/liveness',
        '/payment-breakdown',
        '/payment-status',
        '/thank-you'
    ]
};
