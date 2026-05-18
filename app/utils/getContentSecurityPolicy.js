const config = require('config');

const getContentSecurityPolicy = (nonce) => (
    {
        directives: {
            defaultSrc: ['\'self\''],
            fontSrc: [
                '\'self\' data:',
                'fonts.gstatic.com'
            ],
            scriptSrc: [
                '\'self\'',
                '\'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw=\'',
                '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\'',
                '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\'',
                '\'sha256-nWZRr0RF4OANYiYcCteeOrMWiiSKIEIE+qPfFTq/WyI=\'',
                '\'sha256-L7viC3kUpXu9uCOi97VqCR2bLlMwSQlmLmSuuQ93ngU=\'',
                '*.google-analytics.com',
                'https://*.dynatrace.com',
                '*.googletagmanager.com',
                `'nonce-${nonce}'`,
                config.webchat.kerv.genesysBaseUrl,
            ],
            connectSrc: [
                '\'self\'',
                '*.google-analytics.com',
                '*.g.doubleclick.net',
                'tagmanager.google.com',
                'https://*.dynatrace.com',
                'https://api.hmcts.hs-cx.com',
                config.webchat.kerv.kervBaseUrl,
                // these being fixed values here seems like it's going to fail at some point
                'https://api.euw2.pure.cloud',
                'https://api-cdn.euw2.pure.cloud',
                'wss://webmessaging.euw2.pure.cloud',
            ],
            mediaSrc: [
                '\'self\''
            ],
            imgSrc: [
                '\'self\'',
                '\'self\' data:',
                '*.google-analytics.com',
                '*.g.doubleclick.net',
                'ssl.gstatic.com',
                'www.gstatic.com',
                'lh3.googleusercontent.com',
                '*.googletagmanager.com',
            ],
            styleSrc: [
                '\'self\'',
                '\'unsafe-inline\'',
                'tagmanager.google.com',
                'fonts.googleapis.com'
            ],
            frameAncestors: ['\'self\''],
            formAction: [
                '\'self\'',
                config.services.equalityAndDiversity.url,
                config.services.payment.externalUrl
            ],
            frameSrc: [
                '\'self\'',
                config.webchat.kerv.genesysBaseUrl,
            ],
        },
        browserSniff: true,
        setAllHeaders: true
    });

module.exports = {
    getContentSecurityPolicy,
};
