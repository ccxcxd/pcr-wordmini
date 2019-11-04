var word_data;
$(document).ready(function () {
    var char_data = JSON.parse($('#char_data').text());
    word_data = JSON.parse($('#word_data').text());
    
    var pre_col = 1;
    $.each(char_data, function (char_id, data) {
        if (data.col < pre_col) {
            $("#char_table").append("<br/>");
            pre_col = 1;
        } else {
            pre_col++;
        }
        // deal with have empty col
        while (pre_col < data.col) {
            $("#char_table").append($("<button>", {"class" : "btn btn-light button-fixedsize"}));
            pre_col++;
        }
        var display_text = data.hira + '/' + data.kata + '/' + data.roma;
        $("#char_table").append($("<button>", {"class" : "btn btn-primary button-fixedsize"})
            .text(display_text)
            .click(function() { popup(char_id); })
        );
    });
    
    $.each(word_data, function (index, data) {
        $("<tr>").append(
            $("<td>").text(data.id),
            $("<td>").text(data.word),
            $("<td>").text(data.first),
            $("<td>").text(data.last),
            $("<td>").append(create_check_button("button_grey", index, "grey", false)),
            $("<td>").append(create_check_button("button_hide", index, "hide", false)),
        ).appendTo("#settings_table");
    });
    new Tablesort(document.getElementById("settings_table"));
});

// Popup the window and show all pictures for a character
function popup(char_id) {
    $("#img_title").text(char_id);
    $("#img_holder").empty();
    $("#img_holder_grey").empty();
    $.each(word_data, function (index, data) {
        if (data.first === char_id && !load_storage("hide", index, false)) {
            var path = "img/" + data.pic + ".png";
            if (load_storage("grey", index, false)) {
                $("#img_holder_grey").append($("<img>", { src: path, "class": "half-transparent" }));
            } else {
                $("#img_holder").append($("<img>", { src: path }));
            }
        }
    });
    $("#img_modal").modal("show");
}

// Returns a check mark if val is true, or returns a cross.
function boolean_to_checkmark(val) {
    return val ? "\u2714" : "\u2716";
}

// Creates a button that can toggle value and save its value to storage.
function create_check_button(id_prefix, index, storage_name, default_val) {
    var element_id = id_prefix + index;
    var state = load_storage(storage_name, index, default_val);
    return $("<button>", { id: element_id, "class": "btn btn-primary" })
        .prop("data-checked", state)
        .text(boolean_to_checkmark(state))
        .click(function() {
            var new_state = !($(this).prop("data-checked"));
            $(this).prop("data-checked", new_state).text(boolean_to_checkmark(new_state));
            save_storage(storage_name, id_prefix);
        });
}

// For all object whose id is from <id_prefix>0 to 
// <id_prefix><word_data.length - 1>, puts their "data-checked" value into an array
// of boolean values and then saves the array as a local storage object called
//  <storage_name>.
// Note the name starts from 0, it is not the word.id (starts at 1).
function save_storage(storage_name, id_prefix) {
    var data = [];
    for(var i = 0; i < word_data.length; i++) {
        data.push($("#" + id_prefix + i).prop("data-checked"));
    }
    localStorage.setItem(storage_name, JSON.stringify(data));
}

// Note the index starts from 0, it is not the word.id (starts at 1).
function load_storage(name, index, default_val) {
    var storage_string = localStorage.getItem(name);
    if (storage_string == null)
        return default_val;

    var storage_val = JSON.parse(storage_string);
    if (storage_val.length <= index)
        return default_val;
    else
        return storage_val[index];
}