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

app.use(express.static(config.frontend))

let x = 0
app.use('/test', (req, res) => {
    res.json({ test: ++x })
})

app.listen(config.port, () => {
    console.log('Backend listening on ', config.port)
})