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

const generateData = async deleteExisting => {
    if(deleteExisting) {
        console.log('Delete existing people...')
        let count = (await Person.deleteMany({})).deletedCount
        console.log(count + ' done')
    }
    console.log('Generate and save %d persons', NumOfPersons)
    for(let i = 0; i < NumOfPersons; i++) {
        let person = new Person({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            birthDate: faker.date.birthdate(),
            education: Math.floor(Math.random() * 3)
        })
        await person.save()
        process.stdout.write('\r' + (i + 1) + ' ')
    }
    console.log('done')
    process.exit(0)
}

mongoose.connect(config.dbUrl)
.then(() => {
    console.log('Database connected')
    generateData(deleteExisting)
})
.catch(err => console.error(err.message))