(function() {
    'use strict';

    const mainForm = document.querySelector('#main-form');
    const submitButton = document.querySelector('#main-form button');
    submitButton.addEventListener('click', () => {
        submitButton.setAttribute('disabled', 'disabled');
        mainForm.submit();
    });
}).call(this);
