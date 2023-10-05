<template>
  <h2>TestComponent</h2>
</template>

<script>
export default {
  name: 'TestComponent',
  mounted: () => console.log('TestComponent mounted')
}
</script>

<style scoped>
h2 {
  color: red;
}
</style>
