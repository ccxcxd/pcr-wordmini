var word_data;
$(document).ready(function () {
    var char_data = JSON.parse($('#char_data').text());
    word_data = JSON.parse($('#word_data').text());
    
    // Main window
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
    
    // Settings window
    $.each(word_data, function (index, data) {
        $("<tr>").append(
            $("<td>").text(data.id),
            $("<td>").text(data.word),
            $("<td>").text(data.first),
            $("<td>").text(data.last),
            $("<td>").append(create_check_button("button_grey", index, "grey", false)),
            $("<td>").append(create_check_button("button_hide", index, "hide", false)),
            $("<td>").append(create_check_button("button_highlight", index, "highlight", false)),
        ).appendTo("#settings_table");
    });
    new Tablesort(document.getElementById("settings_table"));
    
    // Export/Impoer window
    $("#export_btn").click(function () {
        var out_text = "";
        $.each(word_data, function (index, data) {
            var data_array = [data.id, data.word, data.first, data.last];
            data_array.push(load_storage("grey", index, false).toString().toUpperCase());
            data_array.push(load_storage("hide", index, false).toString().toUpperCase());
            data_array.push(load_storage("highlight", index, false).toString().toUpperCase());
            out_text += data_array.join('\t') + "\n";
        });
        $("#import_text").val(out_text);
        $("#import_modal").modal();
    });
    
    $("#import_btn").click(function () {
        var in_text = $("#import_text").val();
        var lines = in_text.split(/\r\n|\n/);
        for (var i = 0; i < lines.length; i++) {
            var line_string = lines[i];
            if (line_string === "")
                continue;
            var line = line_string.split(/\t|,/);
            if (line.length < 7) {
                alert("无效数据/Invalid data: " + line_string);
                return;
            }
            var word_id = parseInt(line[0]);
            if (word_id === NaN || word_id < 1 || word_id > word_data.length) {
                alert("无效数据/Invalid data: " + line_string);
                return;
            }
            var index = word_id - 1;  // atlas ID 1 => array index 0
            
            // Returns true if success
            var processValue = function(index, string_val, id_prefix) {
                var val;
                if (string_val.toLowerCase() === "true") {
                    val = true;
                } else if (string_val.toLowerCase() === "false") {
                    val = false;
                } else {
                    return false;
                }
                $("#" + id_prefix + i).prop("data-checked", val);
                return true;
            };
            if (!processValue(index, line[4], "button_grey") ||
                !processValue(index, line[5], "button_hide") ||
                !processValue(index, line[6], "button_highlight")) {
                alert("无效数据/Invalid data: " + line_string);
                return;
            }
        }
        save_storage("grey", "button_grey");
        save_storage("hide", "button_hide");
        save_storage("highlight", "button_highlight");
        location.reload();
    });
});

// Popup the window and show all pictures for a character
function popup(char_id) {
    $("#img_title").text(char_id);
    $("#img_holder_highlight").empty();
    $("#img_holder").empty();
    $("#img_holder_grey").empty();
    $.each(word_data, function (index, data) {
        if (data.first === char_id && !load_storage("hide", index, false)) {
            var img_obj = $("<img>", { src: "img/" + data.pic + ".png" });
            var onclick = function () {
                $("#button_grey" + index).click();
                popup(char_id);
            };
            
            if (load_storage("highlight", index, false)) {
                img_obj.addClass("pic-highlight").appendTo("#img_holder_highlight");
            } else if (load_storage("grey", index, false)) {
                img_obj.addClass("half-transparent").click(onclick).appendTo("#img_holder_grey");
            } else {
                img_obj.click(onclick).appendTo("#img_holder");
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