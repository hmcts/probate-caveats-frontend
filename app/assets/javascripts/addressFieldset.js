(function() {
    const addressFields = document.querySelectorAll('#details-panel input[type="text"]');
    const findAddressButton = document.getElementById('findAddress');
    const submitAddressButton = document.getElementById('submitAddress');

    addressFields.forEach(function(field) {
        field.addEventListener('focus', function(e) {
            findAddressButton.setAttribute('disabled', true);
        });

        field.addEventListener('keypress', function(e) {
            if (e.keyCode === 13) {
                submitAddressButton.click();
            }
        });
    })
})();
