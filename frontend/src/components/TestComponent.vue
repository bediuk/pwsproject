<template>
  <v-card class="box" variant="outlined">
    <v-card-title>Test Component</v-card-title>
    <v-card-text>
      Body
    </v-card-text>
    <v-card-actions class="actions">
      <v-btn variant="elevated" color="primary" @click="action">Action</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'TestComponent',
  mounted: () => console.log('TestComponent mounted'),
  methods: {
    action() {
      console.log('Action was performed')
    }
  }
}
</script>

<style scoped>
.box {
  width: 400px;
}
</style>
