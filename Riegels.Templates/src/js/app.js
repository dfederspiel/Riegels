import Calendar from './calendar';
import Test from './Test';

// Expose object to window
window.Test = Test;
window.Calendar = Calendar;

let calendar = new Calendar();
calendar.getEvents();