<template>
  <div>
    <v-card>
      <v-card-title>{{ id ? "Edit" : "Create" }} task</v-card-title>
      <v-card-text>
        <v-form v-model="isTaskValid">
          <v-text-field variant="solo" label="Name" v-model="task.name" :rules="[rules.required]"></v-text-field>
          <v-text-field
            variant="solo"
            label="Status"
            v-model="task.status"
            :rules="[rules.required, rules.validStatus]"
          ></v-text-field>
          <v-select
            v-model="task.selectedProject"
            label="Projects"
            :items="
              projects.map((project) => ({
                value: project,
                title: project.shortcut,
                props: { subtitle: project.name + ' ' + project.startDate.slice(0, 10) },
              }))
            "
            chips
          >
          </v-select>

          <v-select
            v-model="task.workers"
            label="Persons"
            :items="
              task.selectedProject?.workers.map((personId) => {
                const person = persons.filter(item => item?._id === personId)[0]
                console.log(person)
                return {
                  value: person?._id,
                  title: person?.firstName,
                  props: { subtitle: person?.firstName + ' ' + person?.lastName },
                }
              })
            "
            chips
            multiple=""
          >
          </v-select>

          <div class="flex-container">
            <v-text-field
              variant="solo"
              label="Shortcut"
              v-model="task.shortcut"
              :rules="[rules.required]"
            ></v-text-field>
            <v-color-picker mode="rgb" v-model="task.color" hide-canvas hide-inputs></v-color-picker>
          </div>
          <v-text-field
            variant="solo"
            type="date"
            label="Start date"
            v-model="task.startDate"
            :rules="[rules.validStartDate]"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add" :disabled="!isTaskValid" v-if="!id">Add</v-btn>
        <v-btn variant="elevated" color="success" @click="modify" :disabled="!isTaskValid" v-if="id">Modify</v-btn>
        <v-btn variant="elevated" color="error" @click="remove" v-if="id">Remove</v-btn>
        <v-btn variant="elevated" color="warning" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="confirmation" width="auto">
      <ConfirmationDialog
        :question="'Are you sure to delete \'' + task.name + '\' ?'"
        @ok="removeReal"
        @cancel="confirmation = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import common from "../mixins/common";
import ConfirmationDialog from "./ConfirmationDialog.vue";

export default {
  name: "TaskEditor",
  props: ["id"],
  components: { ConfirmationDialog },
  emits: ["cancel", "dataChanged", "dataAccessFailed"],
  mixins: [common],
  methods: {
    add() {
      const task = {
        name: this.task.name,
        status: this.task.status || 0, // Make sure a valid default value is provided if necessary
        workers: this.task.workers || [],
        color: this.task.color,
        shortcut: this.task.shortcut,
        startDate: this.task.startDate,
        project_ids: this.task.selectedProject,
      };
      console.log(task);
      fetch("/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          this.$emit("dataChanged", data);
        })
        .catch((err) => this.$emit("dataAccessFailed", err.message));
    },
    modify() {
      const task = {
        name: this.task.name,
        status: this.task.status,
        workers: this.task.workers,
        color: this.task.color,
        shortcut: this.task.shortcut,
        startDate: this.task.startDate,
        project_ids: this.task.selectedProject, // Filter out nulls and ensure IDs are valid
      };

      // Check if project_ids is empty or contains null before proceeding
      if (!task.project_ids) {
        // Handle the error: No valid project IDs provided
        alert("Please select at least one valid project.");
        return; // Prevent the request from being sent
      }
      fetch("/task?_id=" + this.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          this.$emit("dataChanged", data);
          this.cancel();
        })
        .catch((err) => {
          console.error(err.message);
          this.$emit("dataAccessFailed", err.message);
        });
    },
    remove() {
      this.confirmation = true;
    },
    removeReal() {
      this.confirmation = false;
      fetch("/task?_id=" + this.id, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          this.$emit("dataChanged");
        })
        .catch((err) => this.$emit("dataAccessFailed", err.message));
    },
    cancel() {
      this.$emit("cancel");
    },
  },
  data() {
    return {
      isTaskValid: false,
      rules: {
        required: (value) => !!value || "empty value is not allowed",
        validStartDate: (value) => !isNaN(new Date(value)) || "valid date required",
        requiredWorkers: (value) => value.length > 0 || "workers are required",
      },
      selectedProject: {},
      projects: [],
      persons: [],
      task: {
        color: this.defaultColor(),
      },
      confirmation: false,
    };
  },
  mounted() {
    fetch("/person?limit=1000", { method: "GET" })
      .then((res) => res.json())
      .then((data) => (this.persons = data));
    fetch("/project?limit=1000", { method: "GET" })
      .then((res) => res.json())
      .then((data) => (this.projects = data));
    if (this.id) {
      fetch("/task?_id=" + this.id, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);

          console.log(data.project_ids[0])
          Object.assign(this.task, data);
          this.task.status = data.status || "0" // or any other valid status value
          this.task.project_id = data.project_id || ""; // or any other valid project_id value

           // HARDCODED 
          this.task.workers = data.workers[0].firstName + ' ' + data.workers[0].lastName // HARDCODED
          this.task.selectedProject = this.projects[0] // HARDCODED
          // HARDCODED
          
          // Переписать для this.task.workers и this.task.selectedProject
          // Когда приходят данные с бэкенда сохранять и показывать
        })
        .catch((err) => console.log(err.message));
    }
  },
};
</script>

<style scoped>
.flex-container {
  display: flex;
}
.flex-container > div {
  padding: 20px;
}
</style>