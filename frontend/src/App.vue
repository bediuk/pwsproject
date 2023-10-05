<template>
  <h1>App</h1>
  <TestComponent/>
  <hr/>
  <div class="footer">Footer</div>
</template>

<script>
import TestComponent from './components/TestComponent.vue'

export default {
  name: 'App',
  components: {
    TestComponent
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
}
.footer {
  font-size: small;
  text-align: center;
}
</style>
