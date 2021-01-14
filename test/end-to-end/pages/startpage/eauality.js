const pcqAAT = 'https://pcq.aat.platform.hmcts.net';
const pagePath = `${pcqAAT}/start-page`;
const equalityEn = 'I don\'t want to answer these questions';
const equalityCy = 'Dydw i ddim eisiau ateb y cwestiynau hyn';

async function completeEquality(language = 'en') {

    const I = this;
    const stepContent = language === 'en' ? equalityEn : equalityCy;

    if (await I.waitForOptionalPage(pagePath)) {
        await I.seeCurrentUrlEquals(pagePath);
        await I.waitForText(stepContent);
        await I.navByClick(stepContent);
    } else {
        const randomNum = Math.floor(Math.random() * 100000);
        await I.saveScreenshot(`equality_pcq_page_not_present_${randomNum}.png`);
        console.log('Equality (PCQ) Page Not Found, skipping.');
    }
}

module.exports = {completeEquality};
