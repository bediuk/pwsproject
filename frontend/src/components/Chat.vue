<template>
    <v-card variant="text">
        <v-card-title>Chat</v-card-title>
        <v-card-text>
        </v-card-text>
    </v-card>
</template>
  
<script>
export default {
    name: 'ChatView',
    props: [ 'user' ],
    data() {
        return {
            connection: null
        }
    },
    mounted() {
        this.connection = new WebSocket('ws://' + window.location.host + '/websocket')
        this.connection.onopen = () => {
            console.log('Websocket connection established')
            this.connection.send('Now is ' + new Date())
        }
        this.connection.onmessage = (event) => {
            console.log('Websocket is getting message', event.data)
       }
    }    
}
</script>
  
<style scoped>
</style>