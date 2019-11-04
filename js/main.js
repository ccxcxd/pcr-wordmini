$(document).ready(function () {
    var char_data = JSON.parse($('#char_data').text());
    var word_data = JSON.parse($('#word_data').text());
    
    var pre_col = 9999;
    var row_obj = null;
    $.each(char_data, function (char_id, data) {
        if (data.col < pre_col) {
            if (row_obj != null) row_obj.appendTo("#char_table");
            row_obj = $("<tr>");
            pre_col = 1;
        } else {
            pre_col++;
        }
        // deal with have empty col
        while (pre_col < data.col) {
            row_obj.append($("<td>"));
            pre_col++;
        }
        var display_text = data.hira + '/' + data.kata + '/' + data.roma;
        var button = $("<button/>")
            .text(display_text)
            .addClass("btn btn-primary")
            .click(function() {popup(char_id, word_data);});
        row_obj.append($("<td>").append(button));
    });
    if (row_obj != null) row_obj.appendTo("#char_table");
});

function popup(char_id, word_data) {
    $("#img_title").text(char_id);
    $("#img_holder").empty();
    $.each(word_data, function (word_id, data) {
        if (data.first === char_id) {
            $("#img_holder").append('<img src="img/' + data.pic + '.png"/>');
        }
    });
    $('#img_modal').modal('show');
}
