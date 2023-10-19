<template>
  <v-card class="box" variant="outlined">
    <v-card-title>Persons</v-card-title>
    <v-card-text>
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
    console.log(this.persons)
  } 
}
</script>

<style scoped>
.box {
  width: 500px;
}
</style>
