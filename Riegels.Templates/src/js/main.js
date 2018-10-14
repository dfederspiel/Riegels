var source = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);

$.get('/api/events', function(response) {
    $.each(response.items, function(idx, item) {
        console.log(moment(item.created).format('ll'));
        console.log(item);
    });
    var context = response;
    var html = template(context);
    $('.events').html(html);
})