<template>
  <div>
    <v-card>
      <v-card-title>{{ id ? 'Edit' : 'Create' }} project</v-card-title>
      <v-card-text>
        <v-form v-model="isProjectValid">
          <v-text-field variant="solo" label="Name" v-model="project.name" :rules="[ rules.required ]"></v-text-field>
          <v-color-picker width="100%" show-swatches v-model="project.color" hide-canvas hide-inputs></v-color-picker>
          <div class="flex-container">
            <v-text-field variant="solo" label="Shortcut" v-model="project.shortcut" :rules="[ rules.required ]"></v-text-field>
            <v-text-field variant="solo" type="date" label="Start date" v-model="project.startDate" :rules="[ rules.validStartDate ]"></v-text-field>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add" :disabled="!isProjectValid" v-if="!id">Add</v-btn>
        <v-btn variant="elevated" color="success" @click="modify" :disabled="!isProjectValid" v-if="id">Modify</v-btn>
        <v-btn variant="elevated" color="error" @click="remove" v-if="id">Remove</v-btn>
        <v-btn variant="elevated" color="warning" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="confirmation" width="auto">
      <ConfirmationDialog :question="'Are you sure to delete \'' + project.name + '\' ?'" @ok="removeReal" @cancel="confirmation = false"/>
    </v-dialog>
  </div>
</template>

<script>
import ConfirmationDialog from './ConfirmationDialog.vue'

export default {
  name: 'ProjectEditor',
  props: [ 'id' ],
  components: { ConfirmationDialog },
  emits: [ 'cancel', 'dataChanged' ],
  methods: {
    add() {
      fetch('/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.project) })
        .then((res) => {
          res.json()
            .then(() => {
              this.$emit('dataChanged')
            })
            .catch((err) => console.error(err.message))
        })
        .catch((err) => console.error(err.message))
    },
    modify() {
      fetch('/project?_id=' + this.id, {
          method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.project) })
        .then((res) => {
          res.json()
            .then(() => {
              this.$emit('dataChanged')
            })
            .catch(err => console.error(err.message))
        })
        .catch(err => console.error(err.message))
    },
    remove() {
      this.confirmation = true
    },
    removeReal() {
      this.confirmation = false
      fetch('/project?_id=' + this.id, {
        method: 'DELETE' })
        .then((res) => {
          res.json()
            .then(() => {
              this.$emit('dataChanged')
            })
            .catch((err) => console.error(err.message))
        })
        .catch((err) => console.error(err.message))
    },
    cancel() {
      this.$emit('cancel')
    }
  },
  data() {
    return {
      isProjectValid: false,
      rules: {
        required: value => !!value || 'empty value is not allowed',
        validStartDate: value => !isNaN(new Date(value)) || 'valid date required'
      },
      project: {},
      dialog: false,
      confirmation: false     
    }
  },
  mounted() {
    if(this.id) {
      fetch('/project?_id=' + this.id, { method: 'GET' })
      .then((res) => {
        res.json()
        .then(data => {
          Object.assign(this.project, data)
        })
        .catch((err) => console.error(err.message))
      })
      .catch((err) => console.error(err.message))
    } else {
      this.project = {
        birthDate: new Date().toISOString().slice(0, 10),
        education: 0
      }
    }
  } 
}
</script>

<style scoped>
.flex-container {
  display: flex;
}
.flex-container > div {
  padding: 20px;
}</style>