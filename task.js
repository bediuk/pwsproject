const mongoose = require("mongoose");
const person = require("./person");
const project_id = require("./project")

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  status: { type: Number, required: true, enum: [0, 1, 2, 3] },
  workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }]
}, {
  versionKey: false,
  additionalProperties: false,
});

let model = null;

module.exports = {
  getSchema: () => schema,
  getModel: () => model,
  init: (connection) => {
    model = connection.model("Task", schema);
    return model;
  },

  get: (req, res) => {
    const _id = req.query._id;
    if (_id) {
      model
        .findOne({ _id })
        .populate('workers')
        .then((data) => {
          if (data) {
            res.json(data);
          } else {
            res.status(404).json({ error: "No such object" });
          }
        })
        .catch((err) => {
          res.status(408).json({ error: err.message });
        });
    } else {
      let aggregation = [
        { $sort: { name: 1 } },
      ];
      aggregation.push({ $skip: parseInt(req.query.skip) || 0 });
      aggregation.push({ $limit: parseInt(req.query.limit) || 10 });
      model
        .aggregate(aggregation)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.status(408).json({ error: err.message });
        });
    }
  },

  post: (req, res) => {
    const { status, project_id, workers } = req.body;
    if (!status || !project_id) {
      return res.status(400).json({ error: "Both status and project_id are required." });
    }
    const instance = new model({ status, project_id, workers });
    instance
      .save()
      .then((data) => {
        // Add the task to the workers' tasks array
        const workerPromises = workers.map(workerId => {
          return person.getModel().findOneAndUpdate({ _id: workerId }, { $addToSet: { tasks: data._id } }, { new: true });
        });
        Promise.all(workerPromises)
          .then(() => {
            res.json(data);
          })
          .catch((err) => {
            res.status(406).json({ error: err.message });
          });
      })
      .catch((err) => {
        res.status(406).json({ error: err.message });
      });
  },

  put: (req, res) => {
    const _id = req.query._id
    const { name, status, workers, ...rest } = req.body
    if (!name || !status || !Array.isArray(workers)) {
      return res.status(400).json({ error: 'Invalid request body' })
    }
    const updatedTask = { name, status, workers, ...rest }
    model.findOneAndUpdate({ _id }, updatedTask, { new: true, runValidators: true })
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
  },

  delete: (req, res) => {
    const _id = req.query._id;
    model
      .findOneAndDelete({ _id })
      .then((deleted) => {
        if (deleted) {
          person
            .getModel()
            .updateMany({}, { $pull: { tasks: _id } })
            .then(() => res.json(deleted))
            .catch((err) => res.status(400).json({ error: err.message }));
        } else {
          res.status(404).json({ error: "No such object" });
        }
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  },
};