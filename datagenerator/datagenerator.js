const fs = require('fs')

const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')

let config = {}
try {
    config = JSON.parse(fs.readFileSync('../config.json'))
} catch(err) {
    console.error(err.message)
    process.exit(0)
}

const deleteExisting = true
const NumOfPersons = 1000

const Person = new mongoose.model('Person', new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true, transform: v => v.toISOString().slice(0, 10) },
    education: { type: Number, required: false, enum: [ 0, 1, 2 ], default: 0 }
}, {
    versionKey: false,
    additionalProperties: false
}))

let remainingToSave = NumOfPersons

mongoose.connect(config.dbUrl)
.then(() => {
    console.log('Database connected')
    if(deleteExisting) {
        console.log('Dropping collection "%s"', Person.collection.name)
        if(!Person.collection.drop()) {
            console.error('Drop failed')
            process.exit(0)
        }
    }
    console.log('Generate and save %d persons', NumOfPersons)
    for(let i = 0; i < NumOfPersons; i++) {
        let person = new Person({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            birthDate: faker.date.birthdate(),
            education: Math.floor(Math.random() * 3)
        })
        person.save()
        .then(saved => {
            console.log(JSON.stringify(saved), 'saved')
            remainingToSave--
            if(!remainingToSave) {
                console.log('Finished')
            }  
        })
        .catch(err => {
            console.error(err.message)
            process.exit(0)
        })
    }
})
.catch(err => console.error(err.message))