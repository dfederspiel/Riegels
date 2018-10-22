import Calendar from './events';
import $ from 'jquery';
import ScrollReveal from 'scrollreveal'

// Expose object to window
window.Calendar = Calendar;

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

var reveal = {
    opacity: 0,
    reset: true,
};

let calendar = new Calendar();
calendar.getEvents(() => {
    ScrollReveal().reveal('.events .reveal', reveal);
});

ScrollReveal().reveal('.reveal', reveal);
