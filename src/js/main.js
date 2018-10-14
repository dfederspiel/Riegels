var source = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);

$.get('http://localhost:3000/events', (response) => {
    $.each(response.items, (idx, item) => {
        console.log(moment(item.created).format('ll'));
        console.log(item);
    });
    var context = response;
    var html = template(context);
    $('.events').html(html);
})