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
                '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\'',
                '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\'',
                '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\'',
                'www.google-analytics.com',
                'www.googletagmanager.com',
                `'nonce-${nonce}'`,
                'webchat.training.ctsc.hmcts.net',
                'webchat.ctsc.hmcts.net',
                'webchat-client.training.ctsc.hmcts.net',
                'webchat.pp.ctsc.hmcts.net',
                'webchat-client.pp.ctsc.hmcts.net',
                'webchat-client.ctsc.hmcts.net'
            ],
            connectSrc: [
                '\'self\'',
                'www.google-analytics.com',
                'stats.g.doubleclick.net',
                'tagmanager.google.com',
                'https://webchat.training.ctsc.hmcts.net',
                'https://webchat.ctsc.hmcts.net',
                'https://webchat-client.training.ctsc.hmcts.net',
                'https://webchat-client.ctsc.hmcts.net',
                'wss://webchat.ctsc.hmcts.net',
                'wss://webchat.pp.ctsc.hmcts.net',
                'https://webchat.pp.ctsc.hmcts.net',
                'https://webchat-client.pp.ctsc.hmcts.net',
                'wss://webchat.training.ctsc.hmcts.net'
            ],
            mediaSrc: [
                '\'self\''
            ],
            imgSrc: [
                '\'self\'',
                '\'self\' data:',
                'www.google-analytics.com',
                'stats.g.doubleclick.net',
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
