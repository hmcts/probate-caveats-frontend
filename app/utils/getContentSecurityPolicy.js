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
                '*.google-analytics.com',
                'https://*.dynatrace.com',
                '*.googletagmanager.com',
                `'nonce-${nonce}'`,
                'webchat.ctsc.hmcts.net',
                'webchat.pp.ctsc.hmcts.net',
                'webchat-client.pp.ctsc.hmcts.net',
                'webchat-client.ctsc.hmcts.net'
            ],
            connectSrc: [
                '\'self\'',
                '*.google-analytics.com',
                '*.g.doubleclick.net',
                'tagmanager.google.com',
                'https://*.dynatrace.com',
                'https://webchat.ctsc.hmcts.net',
                'https://webchat-client.ctsc.hmcts.net',
                'wss://webchat.ctsc.hmcts.net',
                'wss://webchat.pp.ctsc.hmcts.net',
                'https://webchat.pp.ctsc.hmcts.net',
                'https://webchat-client.pp.ctsc.hmcts.net'
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
                'lh3.googleusercontent.com'
            ],
            styleSrc: [
                '\'self\'',
                '\'unsafe-inline\'',
                'tagmanager.google.com',
                'fonts.googleapis.com'
            ],
            frameAncestors: ['\'self\'']
        },
        browserSniff: true,
        setAllHeaders: true
    });

module.exports = {
    getContentSecurityPolicy,
};
