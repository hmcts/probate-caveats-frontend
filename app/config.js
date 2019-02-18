module.exports = {

    environment: process.env.REFORM_ENVIRONMENT || 'prod',
    nodeEnvironment: process.env.NODE_ENV,
    gitRevision: process.env.GIT_REVISION,
    featureToggles: {
        url: process.env.FEATURE_TOGGLES_API_URL || 'http://localhost:8282',
        path: process.env.FEATURE_TOGGLES_PATH || '/api/ff4j/check'
    },
    app: {
        authorization: process.env.ORCHESTRATION_USER_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJtanJ2NW1uZzliMGxwNG9jZDc5Z2lua2o3YyIsInN1YiI6IjM3IiwiaWF0IjoxNTUwNTA0MTAxLCJleHAiOjE1NTA1MzI5MDEsImRhdGEiOiJjYXNld29ya2VyLXByb2JhdGUsY2l0aXplbixjYXNld29ya2VyLGNhc2V3b3JrZXItcHJvYmF0ZS1sb2ExLGNpdGl6ZW4tbG9hMSxjYXNld29ya2VyLWxvYTEiLCJ0eXBlIjoiQUNDRVNTIiwiaWQiOiIzNyIsImZvcmVuYW1lIjoiVXNlciIsInN1cm5hbWUiOiJUZXN0IiwiZGVmYXVsdC1zZXJ2aWNlIjoiQ0NEIiwibG9hIjoxLCJkZWZhdWx0LXVybCI6Imh0dHBzOi8vbG9jYWxob3N0OjkwMDAvcG9jL2NjZCIsImdyb3VwIjoiY2FzZXdvcmtlciJ9.wrSZO3gW1WsjK6mWHj-AsBsSMn7Qh1q9qtIWrNbs8fM',
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
        validation: {
            url: process.env.VALIDATION_SERVICE_URL || 'http://localhost:8080/validate'
        },
        submit: {
            url: process.env.SUBMIT_SERVICE_URL || 'http://localhost:8181',
            port: 8181
        },
        orchestration: {
            url: process.env.ORCHESTRATION_SERVICE_URL || 'http://localhost:8888',
            port: 8888,
            paths: {
                checkanswerspdf: 'documents/generate/checkAnswersSummary'
            }
        },
        idam: {
            loginUrl: process.env.IDAM_LOGIN_URL || 'https://localhost:8000/login',
            apiUrl: process.env.IDAM_API_URL || 'http://localhost:8484',
            roles: ['probate-private-beta', 'citizen'],
            s2s_url: process.env.IDAM_S2S_URL || 'http://localhost:4502',
            service_name: 'probate_frontend',
            service_key: process.env.IDAM_SERVICE_KEY || 'AAAAAAAAAAAAAAAA',
            probate_oauth2_client: 'probate',
            probate_oauth2_secret: process.env.IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_PROBATE || '123456',
            probate_oauth_callback_path: '/oauth2/callback'
        },
        payment: {
            createPaymentUrl: process.env.PAYMENT_CREATE_URL || 'http://localhost:8383/card-payments',
            authorization: process.env.PAYMENT_AUTHORIZATION || 'dummy_token',
            serviceAuthorization: process.env.PAYMENT_SERVICE_AUTHORIZATION || 'dummy_token',
            userId: process.env.PAYMENT_USER_ID || 999999999,
            returnUrlPath: '/payment-status'
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
    gaTrackingId: process.env.GA_TRACKING_ID || '',
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
        citizenAdvice: 'https://www.citizensadvice.org.uk/'
    },
    helpline: {
        number: '0300 303 0648',
        hours: 'Monday to Friday, 9am to 5pm'
    },
    utils: {
        api: {
            retries: process.env.RETRIES_NUMBER || 10,
            retryDelay: process.env.RETRY_DELAY || 1000
        }
    },
    payment: {
        applicationFee: 20,
        applicationFeeThreshold: 5000,
        applicationFeeCode: process.env.APPLICATION_FEE_CODE || 'FEE0226',
        copies: {
            uk: {
                fee: 0.5,
                code: process.env.UK_COPIES_FEE_CODE || 'FEE0003',
                version: '3'
            },
            overseas: {
                fee: 0.5,
                code: process.env.OVERSEAS_COPIES_FEE_CODE || 'FEE003',
                version: '3'
            }
        },
        serviceId: process.env.SERVICE_ID || 'PROBATE',
        siteId: process.env.SITE_ID || 'P223',
        version: process.env.version || '1',
        currency: process.env.currency || 'GBP'
    },
    healthEndpoint: '/health',
    appInsights: {
        instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATION_KEY
    }
};
