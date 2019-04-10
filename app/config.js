module.exports = {

    frontendPublicHttpProtocol: process.env.PUBLIC_PROTOCOL || 'http',
    environment: process.env.REFORM_ENVIRONMENT || 'prod',
    nodeEnvironment: process.env.NODE_ENV,
    gitRevision: process.env.GIT_REVISION,
    featureToggles: {
        url: process.env.FEATURE_TOGGLES_API_URL || 'http://localhost:8282',
        path: process.env.FEATURE_TOGGLES_PATH || '/api/ff4j/check',
        caveats_shutter_toggle: 'probate-caveats-fe-shutter'
    },
    app: {
        useHttps: process.env.USE_HTTPS || 'false',
        port: process.env.PORT || '3000',
        useCSRFProtection: 'true'
    },
    services: {
        postcode: {
            url: process.env.POSTCODE_SERVICE_URL || 'http://localhost:8585/find-address',
            token: process.env.POSTCODE_SERVICE_TOKEN,
            proxy: process.env.http_proxy,
            port: 8585,
            path: '/find-address'
        },
        orchestration: {
            url: process.env.ORCHESTRATION_SERVICE_URL || 'http://localhost:8888',
            port: 8888,
            paths: {
                checkanswerspdf: 'documents/generate/checkAnswersSummary'
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
            caveat_redirectUrl: '/oauth2/callback'
        },
        payment: {
            createPaymentUrl: process.env.PAYMENT_CREATE_URL || 'http://localhost:8383/card-payments',
            authorization: process.env.PAYMENT_AUTHORIZATION || 'dummy_token',
            serviceAuthorization: process.env.PAYMENT_SERVICE_AUTHORIZATION || 'dummy_token',
            userId: process.env.PAYMENT_USER_ID || 999999999,
            returnUrlPath: '/payment-status'
        },
        persistence: {
            url: process.env.PERSISTENCE_SERVICE_URL || 'http://localhost:8282/formdata',
            port: 8282,
            path: '/formdata'
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
    links: {
        cookies: '/cookies',
        privacy: '/privacy-policy',
        terms: '/terms-conditions',
        contact: '/contact-us',
        callCharges: 'https://www.gov.uk/call-charges',
        howToManageCookies: 'https://www.aboutcookies.org',
        googlePrivacyPolicy: 'https://www.google.com/policies/privacy/partners/',
        googleAnalyticsOptOut: 'https://tools.google.com/dlpage/gaoptout/',
        mojPersonalInformationCharter: 'https://www.gov.uk/government/organisations/ministry-of-justice/about/personal-information-charter',
        survey: process.env.SURVEY || 'https://www.smartsurvey.co.uk/',
        surveyEndOfApplication: process.env.SURVEY_END_OF_APPLICATION || 'https://www.smartsurvey.co.uk/',
        applicationFormPA1A: '/public/pdf/probate-application-form-pa1a.pdf',
        applicationFormPA1P: '/public/pdf/probate-application-form-pa1p.pdf',
        whoInheritsLink: 'https://www.gov.uk/inherits-someone-dies-without-will',
        citizenAdvice: 'https://www.citizensadvice.org.uk/',
        stopGrantOfRepresentation: 'https://www.gov.uk/wills-probate-inheritance/stopping-a-grant-of-representation'
    },
    helpline: {
        number: '0300 303 0648',
        email: 'contactprobate@justice.gov.uk',
        hours: 'Monday to Friday, 9am to 5pm'
    },
    serviceline: {
        number: '0300 123 7050',
        email: 'contactprobate@justice.gov.uk',
        hours: 'Monday to Friday, 9am to 5pm'
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
    healthEndpoint: '/health',
    appInsights: {
        instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATION_KEY
    },
    whitelistedPagesForStartPageRedirect: ['/start-page', '/applicant-name', '/cookies', '/privacy-policy',
        '/terms-conditions', '/contact-us', '/offline']
};
