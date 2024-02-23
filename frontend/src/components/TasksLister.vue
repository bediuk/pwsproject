<template>
  <div>
    <v-card variant="text">
      <v-card-title>Tasks</v-card-title>
      <v-card-subtitle>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field variant="solo" label="Search" v-model="search" @input="retrieve"></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select v-model="status" label="Status" :items="[ { value: 0, title: 'PREPARATION' }, { value: 1, title: 'PENDING' }, { value: 2, title: 'IN TESTS' }, { value: 3, title: 'COMPLETED' } ]" chips multiple @update:modelValue="retrieve">
              </v-select>
            </v-col>
            <v-col cols="2">
              <v-text-field variant="solo" type="number" label="Skip" v-model="skip" @input="retrieve"></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field variant="solo" type="number" label="Limit" v-model="limit" @input="retrieve"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-subtitle>
      <v-card-text>
        <v-table density="compact" hover>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Shortcut</th>
              <th class="text-right">Start date</th>
              <th class="text-right">Members</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(task, index) in tasks" :key="index" @click="checkIfInRole(user, [1]) && click(task)">
              <td>{{ task.name }}</td>
              <td>
                <v-chip :color="task.color">{{ task.shortcut }}</v-chip>
              </td>
              <td class="text-right">{{ new Date(task.startDate).toLocaleDateString() }}</td>
              <td class="text-right">{{ task.workers ? task.workers.length : 0 }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add" v-if="checkIfInRole(user, [1])">Add</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="editor" width="50%">
      <TasksEditor :id="id" @dataChanged="retrieve" @cancel="cancel" />
    </v-dialog>
  </div>
</template>

<script>
import common from "../mixins/common";
import TasksEditor from "./TasksEditor.vue";

export default {
  name: "TasksLister", // Update component name
  components: { TasksEditor }, // Update import and component name
  mixins: [common],
  props: ["user"],
  methods: {
    retrieve() {
      this.id = null;
      this.editor = false;
      fetch("/task?search=" + this.search + '&status=' + JSON.stringify(this.status) + "&skip=" + this.skip + "&limit=" + this.limit, {
        // Update API endpoint
        method: "GET",
      })
        .then((res) => {
          res
            .json()
            .then((data) => {
              this.tasks = data;
            })
            .catch((err) => console.error(err.message));
        })
        .catch((err) => console.error(err.message));
    },
    add() {
      this.id = null;
      this.editor = true;
    },
    click(row) {
      this.id = row._id;
      this.editor = true;
    },
    cancel() {
      this.id = null;
      this.editor = false;
    },
  },
  data() {
    return {
      editor: false,
      tasks: [], // Update array name
      id: null,
      search: "",
      skip: 0,
      limit: 10,
      status: [ 0, 1, 2, 3 ],
    };
  },
  mounted() {
    this.retrieve();
  },
};
</script>