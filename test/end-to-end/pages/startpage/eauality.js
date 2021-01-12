const pcqAAT = 'https://pcq.aat.platform.hmcts.net';
const pagePath = `${pcqAAT}/start-page`;
const equalityEn = 'I don\'t want to answer these questions';
const equalityCy = 'Dydw i ddim eisiau ateb y cwestiynau hyn';

async function completeEquality(language = 'en') {

    const I = this;
    const stepContent = language === 'en' ? equalityEn : equalityCy;
    await I.wait(3);

    const url = await I.grabCurrentUrl();

    if (url.startsWith(pcqAAT)) {
        await I.waitInUrl(pagePath);
        await I.seeCurrentUrlEquals(pagePath);
        await I.waitForText(stepContent);
        await I.navByClick(stepContent);
    }
}

module.exports = {completeEquality};
