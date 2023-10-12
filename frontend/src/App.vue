<template>
  <div>
    <h1>App</h1>
    <TestComponent/>
    <hr/>
    <div class="footer">Footer</div>
  </div>
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
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 10px 30px;
}
.footer {
  font-size: small;
  text-align: center;
}
</style>
