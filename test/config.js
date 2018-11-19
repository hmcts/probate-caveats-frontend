module.exports = {

    TestIdamBaseUrl: process.env.IDAM_API_URL || 'http://localhost:8484',
    TestFrontendUrl: process.env.TEST_URL || 'http://localhost:3000',

    TestUseIdam: process.env.USE_IDAM || 'true',
    TestIdamLoginUrl: process.env.IDAM_LOGIN_URL || 'https://localhost:8000/login',

    TestUseGovPay: process.env.USE_GOV_PAY || 'true',
    TestInviteIdListUrl: process.env.INVITE_ID_LIST_URL,
    TestPinUrl: process.env.PIN_URL,
    TestInvitationUrl: process.env.INVITATION_URL,
    TestIdamAddUserUrl: process.env.IDAM_ADD_USER_URL,
    TestIdamRole: process.env.IDAM_CITIZEN_ROLE,
    TestCitizenDomain: process.env.CITIZEN_EMAIL_DOMAIN,

    TestGovUkConfirmPaymentUrl: 'www.payments.service.gov.uk',

    TestEnvEmailAddress: process.TEST_EMAIL_ADDRESS || 'douglas.rice@hmcts.net',
    TestEnvMobileNumber: process.env.TEST_MOBILE_NUMBER || '07773055642',
    s2sStubErrorSequence: '000',
    links: {
        cookies: '/cookies',
        terms: process.env.TERMS_AND_CONDITIONS,
        survey: process.env.SURVEY,
        surveyEndOfApplication: process.env.SURVEY_END_OF_APPLICATION,
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
        renunciationForm: 'public/pdf/renunciation.pdf'
    },
    helpline: {
        number: '0300 303 0648',
        hours: 'Monday to Friday, 9am to 5pm'
    }
};
