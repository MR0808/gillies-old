$(document).ready(function () {
    const maxField = 10; //Input fields increment limitation
    const addButton = $('.add_button'); //Add button selector
    const wrapper = $('.field_wrapper'); //Input field wrapper
    let x = 1; //Initial field counter is 1

    //ADD COUNT TO BEGINNING OF FIELD

    // Once add button is clicked
    $(addButton).click(function () {
        //Check maximum number of input fields
        if (x < maxField) {
            x++; //Increase field counter
            const fieldHTML =
                '<div class="input-group mb-3"><input type="text" name="whiskies" id="whiskies" class="form-control" value=""/><span class="input-group-text remove_button" id="add-row"><i class="bi bi-dash-circle"></i></span></div>';
            $(wrapper).append(fieldHTML); //Add field html
        } else {
            alert(
                'A maximum of ' + maxField + ' fields are allowed to be added. '
            );
        }
    });

    // Once remove button is clicked
    $(wrapper).on('click', '.remove_button', function (e) {
        e.preventDefault();
        $(this).parent('div').remove(); //Remove field html
        x--; //Decrease field counter
    });
});
