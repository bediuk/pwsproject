const fs = require('fs')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

let config = {}
try {
    config = JSON.parse(fs.readFileSync('config.json'))
} catch(err) {
    console.error(err.message)
    process.exit(0)
}

const app = express()

app.use(morgan('tiny'))
app.use(cors())

app.use(bodyParser.json())
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message })
})

app.use(express.static(config.frontend))

const Person = new mongoose.model('Person', new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true }
}, {
    versionKey: false
}))

app.get('/person', (req, res) => {
    Person.find()
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.status(408).json({ error: err.message })
    })
})

app.post('/person', (req, res) => {
    const person = new Person(req.body)
    person.save()
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.status(406).json({ error: err.message })
    })    
})

mongoose.connect(config.dbUrl)
.then(() => {
    console.log('Database connected')
    app.listen(config.port, () => {
        console.log('Backend listening on port', config.port)
    })
})
.catch(err => console.error(err.message))