import DeceasedName from '../../../app/steps/ui/deceased/name/index.js';
import TestWrapper from '../../util/TestWrapper.mjs';
import config from 'config';
import testAddressData from '../../data/find-address.json' with {type: 'json'};
import testCommonContent from '../common/testCommonContent.mjs';

const formatAddress = address => address.replace(/,/g, ', ');
const basePath = config.app.basePath;

describe('applicant-address', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedName = basePath + DeceasedName.getUrl();

    beforeEach(async () => {
        testWrapper = await TestWrapper.getInstance('ApplicantAddress');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantAddress');

        it('test right content loaded on the page', (done) => {
            const excludeContent = ['selectAddress'];
            const sessionData = {applicant: {firstName: 'value'}};

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, excludeContent);
                });
        });

        it('test error messages displayed for missing data', (done) => {
            const data = {addressFound: 'none'};

            testWrapper.testErrors(done, data, 'required', ['addressLine1', 'postTown', 'newPostCode']);
        });

        it(`test it redirects to deceased name page: ${expectedNextUrlForDeceasedName}`, (done) => {
            const data = {
                addressLine1: 'value',
                postTown: 'value',
                newPostCode: 'value'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedName);
        });

        it('test the address dropdown box displays all addresses when the user returns to the page', (done) => {
            const sessionData = {
                firstName: 'value',
                addressLine1: 'value',
                postTown: 'value',
                newPostCode: 'value',
                postcode: testAddressData[1].postcode,
                postcodeAddress: formatAddress(testAddressData[1].formattedAddress),
                addresses: testAddressData
            };
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .send(sessionData)
                .end(() => {
                    const contentToCheck = testAddressData.map((address, index) => {
                        const formattedAddress = formatAddress(address.formattedAddress);
                        return `<option value="${index}" ${formattedAddress === sessionData.postcodeAddress ? 'selected' : ''}>${formattedAddress}</option>`;
                    });
                    testWrapper.testDataPlayback(done, contentToCheck);
                });
        });
    });
});
