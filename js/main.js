$(document).ready(function () {
    var char_data = JSON.parse($('#char_data').text());
    var word_data = JSON.parse($('#word_data').text());
    
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
            $("#char_table").append($("<button>")
                .width(100)
                .addClass("btn btn-light")
            );
            pre_col++;
        }
        var display_text = data.hira + '/' + data.kata + '/' + data.roma;
        $("#char_table").append($("<button>")
            .text(display_text)
            .width(100)
            .addClass("btn btn-primary")
            .click(function() {popup(char_id, word_data);})
        );
    });
});

function popup(char_id, word_data) {
    $("#img_title").text(char_id);
    $("#img_holder").empty();
    $.each(word_data, function (word_id, data) {
        if (data.first === char_id) {
            $("#img_holder").append('<img src="img/' + data.pic + '.png"/>');
        }
    });
    $("#img_modal").modal("show");
}
