const getTestLanguages = () => (String(process.env.DONT_TEST_WELSH) === 'true' ? ['en'] : ['en', 'cy']);

module.exports = {
    getTestLanguages
};
