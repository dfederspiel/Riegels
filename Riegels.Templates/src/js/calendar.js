import moment from 'moment';
import $ from "jquery";
import Handlebars from 'handlebars';

var source = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);

const eventsApi = 'http://localhost:3000/api/events';

$.get(eventsApi, function (response) {
    $.each(response.items, function (idx, item) {
        console.log(moment(item.created).format('ll'));
    });
    var context = response;
    var html = template(context);
    $('.events').html(html);
});