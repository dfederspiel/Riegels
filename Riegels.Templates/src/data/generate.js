// https://lodash.com/
// https://github.com/Marak/faker.js
module.exports = function () {
    var faker = require('faker');
    var moment = require('moment');
    var _ = require('lodash');
    return {
        // build random algorithm to find permutations of various properties
        heroVideos: _.times(5, function (n) {
            return {
                id: n,
                heading: "Test",
                subHeading: "Subheading",
                videos: [{
                    id: 0,
                    url: 'http://',
                    mimeType: 'video/webm',
                    date: faker.date.future
                }]
            }
        }),
        sitefinitySelectors: [{
            id: 0,
            tag: 'sf-library-selector',
            attributes: {
                type: {
                    name: "type",
                    default: "sf-library-selector"
                },
                mediaType: {
                    name: "sf-media-type",
                    default: "images"
                },
                multiSelect: {
                    name: "sf-multiselect",
                    default: "false"
                },
                sortable: {
                    name: "sf-sortable",
                    default: "false"
                },
                provider: {
                    name: "sf-provider",
                    default: "properties.ProviderName.PropertyValue"
                },
                selectedIds: {
                    name: "sf-selected-ids",
                    default: "properties.SelectedItemId.PropertyValue"
                },
                selectedItems: {
                    name: "sf-selected-items",
                    default: "properties.SelectedItem.PropertyValue"
                }
            }
        }],
        articles: _.times(20, function (n) {
            var article = {
                id: n,
                title: faker.random.words(Math.ceil(Math.random() * 10)),
                date: faker.date.past(),
                authorId: faker.random.number({
                    min: 0,
                    max: 19
                }),
                body: faker.lorem.words(Math.ceil(Math.random() * 100))
            }; 
            return article;
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
            //"defaultReminders": [],
            "description": "Events for Riegels Pipe and Tobacco",
            items: _.times(5, function(n){
                return {
                    "status": "confirmed",
                    "kind": "calendar#event",
                    "end": {
                        "dateTime": faker.date.between(1,10)
                    },
                    "created": faker.date.between(1,10),
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
                    "summary": "Event 12387628736asd",
                    "start": {
                        dateTime: faker.date.between(1,10)
                    },
                    "etag": "\"3078604264386000\"",
                    "organizer": {
                        "self": true,
                        "displayName": "Justin!",
                        "email": "federnet.com_out8r72vgs8qacea81hahntmd0@group.calendar.google.com"
                    },
                    "creator": {
                        "displayName": "David Federspiel",
                        "email": "david@federnet.com"
                    },
                    "id": "25dkla6tdun80ucu84hseujicf"
                }
            }),
            "updated": "2018-10-14T04:22:01.955Z",
            "summary": "Riegels",
            "etag": "\"p32sfr9mcha2ts0g\"",
            "nextSyncToken": "CLj9psyKhd4CELj9psyKhd4CGAY=",
            "timeZone": "America/New_York",
            "accessRole": "owner"
        }
    };
};