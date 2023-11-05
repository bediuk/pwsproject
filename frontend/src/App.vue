<template>
  <div>
    <div class="onerow">
      <PersonEditor @data-added="onDataAdded" ref="personEditorRef"/>
      <PersonsLister @data-clicked="onDataClicked" ref="personsListerRef"/>
    </div>
    <br/>
    <hr/>
    <div class="footer">Footer</div>
  </div>
</template>

<script>
import PersonEditor from './components/PersonEditor.vue'
import PersonsLister from './components/PersonsLister.vue'

export default {
  name: 'App',
  components: {
    PersonEditor, PersonsLister
  },
  methods: {
    onDataAdded() {
      this.$refs.personsListerRef.retrieve()
    },
    onDataClicked(data) {
      this.$refs.personEditorRef.fill(data)
    }
  }
}
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 10px 30px;
}
.onerow {
  display: flex;
  gap: 5px;
}
.footer {
  font-size: small;
  text-align: center;
}
</style>
