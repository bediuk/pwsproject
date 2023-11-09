<template>
  <div>
    <PersonsLister/>
  </div>
</template>

<script>
import PersonsLister from './components/PersonsLister.vue'

export default {
  name: 'App',
  components: {
    PersonsLister
  }
}
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 10px 30px;
}
</style>