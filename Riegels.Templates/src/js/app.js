import Calendar from './calendar';

// Expose object to window
window.Calendar = Calendar;

let calendar = new Calendar();
calendar.getEvents();