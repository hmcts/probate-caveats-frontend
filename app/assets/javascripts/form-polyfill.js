(function() {
    var _input = document.createElement('input');

    if (!('formTarget' in _input && 'formAction' in _input)) {
        $('[type="submit"]').on('click', function (e) {
            // Prevent default form submit
            e.preventDefault();

            // Find parent form and store values
            var $this = $(this),
                $form = $this.closest('form'),
                formTarget = $form.attr('target'),
                formAction = $form.attr('action');


            // Check if a target is defined and set the form target accordingly
            if ($this.attr('formtarget') !== null)
                $form.attr('target', $this.attr('formtarget'));

            // Check if an action is defined and set the form action accordingly
            if ($this.attr('formaction') !== null)
                $form.attr('action', $this.attr('formaction'));

            // Submit form
            $form.submit();

            // Set form back to initial values
            $form.attr('target', formTarget);
            $form.attr('action', formAction);
        });
    }
})();
