import Calendar from './calendar';
import $ from 'jquery';

// Expose object to window
window.Calendar = Calendar;

let calendar = new Calendar();
calendar.getEvents();

// Scroll to sections
$('.js-anchor').click((evt) => {
    $('html, body').animate({
        scrollTop: $(evt.target.attributes['href'].value).offset().top - 25
     }, 800);
     evt.preventDefault();
})

$('.js-back-to-top').click(() => {
    $('html, body').animate({
        scrollTop: 0
     }, 800);
})

$(document).scroll(function(){
    if($(document).scrollTop() > 50)
        $('.js-back-to-top').addClass('visible');
    else
        $('.js-back-to-top').removeClass('visible');
})
