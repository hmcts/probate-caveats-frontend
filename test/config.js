module.exports = {

    TestIdamBaseUrl: process.env.IDAM_API_URL || 'https://idam-api.aat.platform.hmcts.net',
    TestFrontendUrl: process.env.TEST_URL || 'http://localhost:3000',
    TestE2EFrontendUrl: process.env.TEST_E2E_URL || process.env.TEST_URL,
    TestUseSidam: process.env.USE_SIDAM || 'true',
    TestUseGovPay: process.env.USE_GOV_PAY || 'true',
    TestInviteIdListUrl: process.env.INVITE_ID_LIST_URL || '/inviteIdList',
    TestPinUrl: process.env.PIN_URL || '/pin',
    TestInvitationUrl: process.env.INVITATION_URL || '/executors/invitation',
    TestIdamAddUserUrl: process.env.IDAM_ADD_USER_URL || '/testing-support/accounts',
    TestIdamUserGroup: process.env.IDAM_USER_GROUP || 'probate-private-beta',
    TestIdamRole: process.env.IDAM_CITIZEN_ROLE || 'citizen',
    TestCitizenDomain: process.env.CITIZEN_EMAIL_DOMAIN || '/@probateTest.com',
    TestUseProxy: process.env.TEST_USE_PROXY || 'true',
    TestProxy: process.env.TEST_PROXY || 'socks5:proxyout.reform.hmcts.net:8080',
    TestRetryFeatures: process.env.RETRY_FEATURES || 3,
    TestRetryScenarios: process.env.RETRY_SCENARIOS || 0,
    TestDocumentToUpload: 'uploadDocuments/test_file_for_document_upload.png',
    TestWaitForDocumentUpload: 60,
    TestBasePath: '/caveats',

    postcodeLookup: {
        token: process.env.ADDRESS_TOKEN,
        url: process.env.POSTCODE_SERVICE_URL,
        endpoint: process.env.POSTCODE_SERVICE_ENDPOINT || '/addresses',
        contentType: 'application/json',
        singleAddressPostcode: 'SW1A 1AA',
        singleOrganisationName: 'BUCKINGHAM PALACE',
        singleFormattedAddress: 'Buckingham Palace\nLondon\nSW1A 1AA',
        multipleAddressPostcode: 'N145JY',
        partialAddressPostcode: 'N14',
        invalidAddressPostcode: 'Z99 9ZZ',
        emptyAddressPostcode: ''
    },

    govPayTestCardNos: {
        validCardNo: '4242424242424242'
    },

    govPayTestCardDetails: {
        expiryMonth: '06',
        expiryYear: '99',
        cardholderName: 'Test Payment',
        cvc: '123',
        addressLine1: '1',
        addressCity: 'London',
        addressPostcode: 'SW1A1AA'
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

    validation: {
        url: process.env.TEST_VALIDATION_SERVICE_URL || 'http://localhost:8080/validate'
    },

    TestGovUkConfirmPaymentUrl: 'www.payments.service.gov.uk',

    TestEnvEmailAddress: 'masah.aspyn@sellcow.net',
    TestEnvMobileNumber: '07545480473',
    s2sStubErrorSequence: '000',
    links: {
        cookies: '/cookies',
        terms: process.env.TERMS_AND_CONDITIONS,
        survey: process.env.SURVEY,
        surveyEndOfApplication: process.env.SURVEY_END_OF_APPLICATION || 'https://www.smartsurvey.co.uk/',
        privacy: '/privacy-policy',
        contact: '/contact-us',
        callCharges: 'https://www.gov.uk/call-charges',
        howToManageCookies: 'https://www.aboutcookies.org',
        googlePrivacyPolicy: 'https://www.google.com/policies/privacy/partners/',
        googleAnalyticsOptOut: 'https://tools.google.com/dlpage/gaoptout/',
        mojPersonalInformationCharter: 'https://www.gov.uk/government/organisations/ministry-of-justice/about/personal-information-charter',
        goodThingsFoundation: 'https://www.goodthingsfoundation.org',
        subjectAccessRequest: 'https://www.gov.uk/government/publications/request-your-personal-data-from-moj',
        complaintsProcedure: 'https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service/about/complaints-procedure',
        informationCommissionersOffice: 'https://ico.org.uk/global/contact-us',
        ihtNotCompleted: 'https://www.gov.uk/valuing-estate-of-someone-who-died/tell-hmrc-estate-value',
        applicationFormPA15: 'https://www.gov.uk/government/publications/form-pa15-apply-for-renunciation-will'
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
    pact: {
        pactBrokerUrl: process.env.PACT_BROKER_URL || 'http://localhost:80'
    },
};
