const mongoose = require('mongoose')
const person = require('./person')

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true, transform: v => v.toISOString().slice(0, 10) },
    endDate: { type: Date, required: false, transform: v => v.toISOString().slice(0, 10) },
    shortcut: { type: String, required: true },
    color: { type: String, required: false, default: '#000000' },
    status: { type: Number, required: true, enum: [0, 1, 2, 3] },
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }]
}, {
    versionKey: false,
    additionalProperties: false
})

let model = null

module.exports = {

    getSchema: () => schema,
    getModel: () => model,

    init: connection => {
        model = connection.model('Project', schema)
        return model
    },

    get: async (req, res) => {
        const _id = req.query._id
        if(_id) {
            try {
                const data = await model.findOne({ _id })
                if(data) {
                    res.json(data)
                } else {
                    res.status(404).json({ error: 'No such object' })
                }
            } catch(err) {
                res.status(408).json({ error: err.message })
            }
        } else {
            const aggregation = [
                { $sort: { name: 1 }},
                { $match: 
                    { name: { $regex: new RegExp(req.query.search, 'i') } }
                },
                { $lookup: {
                    from: 'people',
                    localField: '_id',
                    foreignField: 'projects',
                    as: 'members'
                }},
                { $set: { members: { $size: '$members' }}}
                
            ]
            aggregation.push({ $skip: parseInt(req.query.skip) || 0 })
            aggregation.push({ $limit: parseInt(req.query.limit) || 10 })
            try {
                const data = await model.aggregate(aggregation)
                res.json(data)
            } catch(err) {
                res.status(408).json({ error: err.message })
            }
        }
    },

    post: async (req, res) => {
        req.body.status = req.body.status || 0; // set default status value
        req.body.workers = req.body.workers || []; // set default workers value
        try {
            const instance = new model(req.body)
            const data = await instance.save()
            res.json(data)
        } catch(err) {
            res.status(406).json({ error: err.message })
        }    
    },

    put: async (req, res) => {
        const _id = req.query._id
        try {
            const updated = await model.findOneAndUpdate({ _id }, req.body, { new: true, runValidators: true })
            if(updated) {
                res.json(updated)
            } else {
                res.status(404).json({ error: 'No such object' })
            }
        } catch(err) {
            res.status(406).json({ error: err.message })
        }
    },

    delete: (req, res) => {
        const _id = req.query._id
        model.findOneAndDelete({ _id }).then((deleted) => {
            if(deleted) {
                person.getModel().updateMany({}, { $pull: { projects: _id } })
                .then(() => res.json(deleted))
                .catch(err => res.status(400).json({ error: err.message }))
            } else {
                res.status(404).json({ error: 'No such object' })
            }
        }).catch(err => {
            res.status(400).json({ error: err.message })
        })
    }

}