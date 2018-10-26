// Use import or require to reference dependencies
import Calendar from './events'; // local library script
import $ from 'jquery'; // node package (preferred for vendor scripts)


// Expose object to the browser
// -- Avoid if possible, but useful if you have a rogue script that 
// -- must cross the moat that is this entire bundle (nothing in here is scoped to the window by default - how cool, how safe! :)
window.Calendar = Calendar;
window.ease = ease;
// TODO: figure out how to include dev and production versions so that dev dependencies can be run in the console.

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
