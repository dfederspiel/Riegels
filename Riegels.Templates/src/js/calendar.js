//https://momentjs.com/docs
import moment from 'moment';

//https://jquery.com/
import $ from "jquery";

//https://handlebarsjs.com/
import Handlebars from 'handlebars';


Handlebars.registerHelper('formatDate', function(date) {
    return moment(date).format("dddd, MMMM Do YYYY, h:mm a");
  });

const eventsApi = '/api/events';

class Calendar {
    constructor() {
        this.source = document.getElementById("entry-template").innerHTML;
        this.template = Handlebars.compile(this.source);

        this.getEvents = this.getEvents.bind(this);
    }

    getEvents() {
        let t = this.template;
        $.get(eventsApi, function (response) {
            $.each(response.items, function (idx, item) {
                console.log(moment(item.created).format('ll'));
            });
            var context = response;
            var html = t(context);
            $('.events').html(html);
        });
    }
}

export default Calendar;