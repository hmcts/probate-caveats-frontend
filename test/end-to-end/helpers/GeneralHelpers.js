const getTestLanguages = () => (String(process.env.DONT_TEST_WELSH) === 'true' ? ['en'] : ['cy', 'en']);

module.exports = {
    getTestLanguages
};
