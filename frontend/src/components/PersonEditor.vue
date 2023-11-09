<template>
  <v-card class="box" variant="outlined">
    <v-card-title>Edit a person</v-card-title>
    <v-card-text>
      <v-form v-model="isPersonValid">
        <v-text-field variant="solo" label="First name" v-model="person.firstName" :rules="[ rules.required ]"></v-text-field>
        <v-text-field variant="solo" label="Last name" v-model="person.lastName" :rules="[ rules.required ]"></v-text-field>
        <v-text-field variant="solo" type="date" label="Birth date" v-model="person.birthDate" :rules="[ rules.validBirthDate ]"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions class="actions">
      <v-btn variant="elevated" color="success" @click="add" :disabled="!isPersonValid">Add</v-btn>
      <v-btn variant="elevated" color="success" @click="modify" :disabled="!isPersonValid || !id">Modify</v-btn>
      <v-btn variant="elevated" color="error" @click="remove" :disabled="!isPersonValid || !id">Remove</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'PersonEditor',
  emits: [ 'dataChanged' ],
  methods: {
    add() {
      fetch('/person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.person) })
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
      fetch('/person?_id=' + this.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.person) })
        .then((res) => {
          res.json()
            .then(() => {
              this.$emit('dataChanged')
            })
            .catch((err) => console.error(err.message))
        })
        .catch((err) => console.error(err.message))
    },
    remove() {
      fetch('/person?_id=' + this.id, {
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
    fill(data) {
      this.person.firstName = data.firstName
      this.person.lastName = data.lastName
      this.person.birthDate = data.birthDate
      this.id = data._id
    }
  },
  data() {
    return {
      isPersonValid: false,
      rules: {
        required: value => !!value || 'empty value is not allowed',
        validBirthDate: value => !isNaN(new Date(value)) || 'valid date required'
      },
      person: {
        firstName: '',
        lastName: '',
        birthDate: new Date().toJSON().slice(0, 10)
      },
      id: null     
    }
  } 
}
</script>

<style scoped>
.box {
  width: 500px;
}
.actions {
  float: right;
}
</style>
