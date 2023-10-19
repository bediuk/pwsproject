<template>
  <v-card class="box" variant="outlined">
    <v-card-title>Persons</v-card-title>
    <v-card-text>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left">
              First name
            </th>
            <th class="text-left">
              Last name
            </th>
            <th class="text-left">
              Birth date
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(person, index) in persons" :key="index">
            <td>{{ person.firstName }}</td>
            <td>{{ person.lastName }}</td>
            <td>{{ new Date(person.birthDate).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'PersonsLister',
  methods: {
    retrieve() {
      fetch('/person', {
        method: 'GET' })
        .then((res) => {
          res.json()
            .then((data) => {
              this.persons = data
            })
            .catch((err) => alert(err.message))
        })
        .catch((err) => alert(err.message))
    }
  },
  data() {
    return {
      persons: []
    }
  },
  mounted() {
    this.retrieve()
  } 
}
</script>

<style scoped>
.box {
  width: 500px;
}
</style>
