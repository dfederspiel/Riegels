// https://lodash.com/
// https://github.com/Marak/faker.js

module.exports = function(){
    var faker = require('faker');
    var _ = require('lodash');

    return { 
        pets: _.times(100, function(n){
            return {
                id: n,
                name: faker.name.firstName(),
                age: faker.random.number({ min: 1, max: 20})
            }
        }),
        articles: _.times(100, function(n){
            return {
                id: n,
                title: faker.random.words(Math.ceil(Math.random() * 10)),
                date: faker.date.past(),
                authorId: faker.random.number({ min: 0, max: 99 }),
                body: faker.lorem.words(Math.ceil(Math.random() * 100))
            };
        }),
        authors: _.times(100, function(n){
            return {
                id: n,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                bio: faker.lorem.words(Math.ceil(Math.random() * 50)),
                website: faker.internet.url()
            };
        }),
    };
};