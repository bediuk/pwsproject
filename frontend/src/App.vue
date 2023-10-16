<template>
  <div>
    <PersonEditor/>
    <hr/>
    <div class="footer">Footer</div>
  </div>
</template>

<script>
import PersonEditor from './components/PersonEditor.vue'

export default {
  name: 'App',
  components: {
    PersonEditor
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
