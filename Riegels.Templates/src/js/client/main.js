var source = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);

const eventsApi = '/api/events';

$.get(eventsApi, function (response) {
    $.each(response.items, function (idx, item) {
        console.log(moment(item.created).format('ll'));
        console.log(item);
    });
    var context = response;
    var html = template(context);
    $('.events').html(html);
});

class Test {
    constructor() {
        this.A = 'a';
        this.B = 'b';
    }
}