const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const config = {
    port: 8000,
    frontend: './frontend/dist'
}

const app = express()

app.use(morgan('tiny'))
app.use(cors())

app.use(bodyParser.json())
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message })
})

app.use(express.static(config.frontend))

let persons = []

app.get('/person', (req, res) => {
    res.json(persons)
})

app.post('/person', (req, res) => {
    req.body.birthDate = new Date(req.body.birthDate)
    persons.push(req.body)
    res.json(req.body)
})

app.listen(config.port, () => {
    console.log('Backend listening on port', config.port)
})