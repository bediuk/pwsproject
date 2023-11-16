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
    birthDate: { type: Date, required: true, transform: v => v.toISOString().slice(0, 10) },
    education: { type: Number, required: false, enum: [ 0, 1, 2 ], default: 0 }
}, {
    versionKey: false,
    additionalProperties: false
}))

app.get('/person', (req, res) => {
    const _id = req.query._id
    if(_id) {
        Person.findOne({ _id })
        .then(data => {
            if(data) {
                res.json(data)
            } else {
                res.status(404).json({ error: 'No such object' })
            }
        })
        .catch(err => {
            res.status(408).json({ error: err.message })
        })
    } else {
        let aggregation = [
            { $sort: { lastName: 1, firstName: 1 }}
        ]
        req.query.search
        aggregation.push({
            $match: { $or: [
                { firstName: { $regex: new RegExp(req.query.search, 'i') } },
                { lastName: { $regex: new RegExp(req.query.search, 'i') } }
            ]}
        })
        aggregation.push({
            $skip: parseInt(req.query.skip)
        })
        aggregation.push({
            $limit: parseInt(req.query.limit)
        })
        Person.aggregate(aggregation)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(408).json({ error: err.message })
        })
    }
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

app.put('/person', (req, res) => {
    const _id = req.query._id
    Person.findOneAndUpdate({ _id }, req.body, { new: true, runValidators: true })
    .then(updated => {
        if(updated) {
            res.json(updated)
        } else {
            res.status(404).json({ error: 'No such object' })
        }
    })
    .catch(err => {
        res.status(406).json({ error: err.message })
    })    
})

app.delete('/person', (req, res) => {
    const _id = req.query._id
    Person.findOneAndDelete({ _id }).then((deleted) => {
        if(deleted) {
            res.json(deleted)
        } else {
            res.status(404).json({ error: 'No such object' })
        }
    }).catch(err => {
        res.status(400).json({ error: err.message })
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