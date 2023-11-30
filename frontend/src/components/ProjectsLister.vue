<template>
  <div>
    <v-card variant="text">
      <v-card-title>Projects</v-card-title>
      <v-card-subtitle>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field variant="solo" label="Search" v-model="search" @input="retrieve"></v-text-field>
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
              <th class="text-left">
                Name
              </th>
              <th class="text-right">
                Start date
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(project, index) in projects" :key="index" @click="click(project)">
              <td>{{ project.name }}</td>
              <td class="text-right">{{ new Date(project.startDate).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add">Add</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="editor" width="50%">
      <ProjectEditor :id="id" @dataChanged="retrieve" @cancel="cancel"/>
    </v-dialog>
  </div>
</template>

<script>
import ProjectEditor from './ProjectEditor.vue'

export default {
  name: 'ProjectsLister',
  components: { ProjectEditor },
  methods: {
    retrieve() {
      this.id = null
      this.editor = false
      fetch('/project?search=' + this.search + '&skip=' + this.skip + '&limit=' + this.limit, {
        method: 'GET' })
        .then((res) => {
          res.json()
            .then((data) => {
              this.projects = data
            })
            .catch(err => console.error(err.message))
        })
        .catch(err => console.error(err.message))
    },
    add() {
      this.id = null
      this.editor = true
    },
    click(row) {
      this.id = row._id
      this.editor = true
    },
    cancel() {
      this.id = null
      this.editor = false
    }
  },
  data() {
    return {
      editor: false,
      projects: [],
      id: null,
      search: '',
      skip: 0,
      limit: 5
    }
  },
  mounted() {
    this.retrieve()
  } 
}
</script>