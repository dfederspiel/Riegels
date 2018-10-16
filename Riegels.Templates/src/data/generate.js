// https://lodash.com/
// https://github.com/Marak/faker.js

module.exports = function () {
    var faker = require('faker');
    var _ = require('lodash');

    return {
        articles: _.times(20, function (n) {
            return {
                id: n,
                title: faker.random.words(Math.ceil(Math.random() * 10)),
                date: faker.date.past(),
                authorId: faker.random.number({ min: 0, max: 99 }),
                body: faker.lorem.words(Math.ceil(Math.random() * 100))
            };
        }),
        authors: _.times(20, function (n) {
            return {
                id: n,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                bio: faker.lorem.words(Math.ceil(Math.random() * 50)),
                website: faker.internet.url()
            };
        }),
        ipsum: _.times(1000, function (n) {
            return faker.lorem.words(1);
        }),
        events: {
            "kind": "calendar#events",
            "defaultReminders": [],
            "description": "Events for Riegels Pipe and Tobacco",
            "items": [
                {
                    "status": "confirmed",
                    "kind": "calendar#event",
                    "end": {
                        "dateTime": "2018-10-12T12:00:00-04:00"
                    },
                    "created": "2018-10-11T23:55:32.000Z",
                    "iCalUID": "25dkla6tdun80ucu84hseujicf@google.com",
                    "reminders": {
                        "useDefault": true
                    },
                    "extendedProperties": {
                        "private": {
                            "everyoneDeclinedDismissed": "-1"
                        }
                    },
                    "htmlLink": "https://www.google.com/calendar/event?eid=MjVka2xhNnRkdW44MHVjdTg0aHNldWppY2YgZmVkZXJuZXQuY29tX291dDhyNzJ2Z3M4cWFjZWE4MWhhaG50bWQwQGc",
                    "sequence": 0,
                    "updated": "2018-10-11T23:55:32.193Z",
                    "summary": "Event One",
                    "start": {
                        "dateTime": "2018-10-12T11:00:00-04:00"
                    },
                    "etag": "\"3078604264386000\"",
                    "organizer": {
                        "self": true,
                        "displayName": "Riegels",
                        "email": "federnet.com_out8r72vgs8qacea81hahntmd0@group.calendar.google.com"
                    },
                    "creator": {
                        "displayName": "David Federspiel",
                        "email": "david@federnet.com"
                    },
                    "id": "25dkla6tdun80ucu84hseujicf"
                },
                {
                    "status": "confirmed",
                    "kind": "calendar#event",
                    "end": {
                        "dateTime": "2018-10-12T12:00:00-04:00"
                    },
                    "created": "2018-10-11T23:55:32.000Z",
                    "iCalUID": "25dkla6tdun80ucu84hseujicf@google.com",
                    "reminders": {
                        "useDefault": true
                    },
                    "extendedProperties": {
                        "private": {
                            "everyoneDeclinedDismissed": "-1"
                        }
                    },
                    "htmlLink": "https://www.google.com/calendar/event?eid=MjVka2xhNnRkdW44MHVjdTg0aHNldWppY2YgZmVkZXJuZXQuY29tX291dDhyNzJ2Z3M4cWFjZWE4MWhhaG50bWQwQGc",
                    "sequence": 0,
                    "updated": "2018-10-11T23:55:32.193Z",
                    "summary": "Event Lindsay",
                    "start": {
                        "dateTime": "2018-10-12T11:00:00-04:00"
                    },
                    "etag": "\"3078604264386000\"",
                    "organizer": {
                        "self": true,
                        "displayName": "Riegels",
                        "email": "federnet.com_out8r72vgs8qacea81hahntmd0@group.calendar.google.com"
                    },
                    "creator": {
                        "displayName": "David Federspiel",
                        "email": "david@federnet.com"
                    },
                    "id": "25dkla6tdun80ucu84hseujicf"
                },
                {
                    "status": "confirmed",
                    "kind": "calendar#event",
                    "end": {
                        "dateTime": "2018-10-12T12:00:00-04:00"
                    },
                    "created": "2018-10-11T23:55:32.000Z",
                    "iCalUID": "25dkla6tdun80ucu84hseujicf@google.com",
                    "reminders": {
                        "useDefault": true
                    },
                    "extendedProperties": {
                        "private": {
                            "everyoneDeclinedDismissed": "-1"
                        }
                    },
                    "htmlLink": "https://www.google.com/calendar/event?eid=MjVka2xhNnRkdW44MHVjdTg0aHNldWppY2YgZmVkZXJuZXQuY29tX291dDhyNzJ2Z3M4cWFjZWE4MWhhaG50bWQwQGc",
                    "sequence": 0,
                    "updated": "2018-10-11T23:55:32.193Z",
                    "summary": "Event One",
                    "start": {
                        "dateTime": "2018-10-12T11:00:00-04:00"
                    },
                    "etag": "\"3078604264386000\"",
                    "organizer": {
                        "self": true,
                        "displayName": "Riegels",
                        "email": "federnet.com_out8r72vgs8qacea81hahntmd0@group.calendar.google.com"
                    },
                    "creator": {
                        "displayName": "David Federspiel",
                        "email": "david@federnet.com"
                    },
                    "id": "25dkla6tdun80ucu84hseujicf"
                }
            ],
            "updated": "2018-10-14T04:22:01.955Z",
            "summary": "Riegels",
            "etag": "\"p32sfr9mcha2ts0g\"",
            "nextSyncToken": "CLj9psyKhd4CELj9psyKhd4CGAY=",
            "timeZone": "America/New_York",
            "accessRole": "owner"
        }
    };
};