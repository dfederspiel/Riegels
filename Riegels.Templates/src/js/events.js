//https://momentjs.com/docs
import moment from 'moment';

//https://jquery.com/
import $ from "jquery";

//https://handlebarsjs.com/
import Handlebars from 'handlebars';


Handlebars.registerHelper('formatDate', function (date) {
    return moment(date).format("dddd, MMMM Do YYYY, h:mm a");
});

Handlebars.registerHelper('address', (address) => {
    return address;
});

const eventsApi = '/api/events';

class Calendar {
    constructor() {
        this.source = document.getElementById("entry-template").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.getEvents = this.getEvents.bind(this);
    }

    getEvents(cb) {
        let hTemplate = this.template;
        $.get(eventsApi, function (response) {
            $.each(response.items, function (idx, item) {
                console.log(moment(item.created).format('ll'));
            });
            var context = response;
            var html = hTemplate(context);
            $('.events').html(html);
            if(cb) cb();
        });
    }
}

export default Calendar;