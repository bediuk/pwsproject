<template>
    <v-card variant="text">
        <v-card-title>Chat</v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item v-for="(data, index) in history" :key="index"
                :subtitle="(data.sender || 'not-logged-in') + ' ' + data.timestamp.toLocaleTimeString()"
                :class="data.sender == user.username ? 'my-message' : 'foreign-message'">
                    {{ data.message }}
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-text-field variant="solo" label="Message" v-model="message">
                <template #append-inner>
                    <v-btn variant="elevated" color="success" @click="send">Send</v-btn>
                </template>
            </v-text-field>
        </v-card-actions>
    </v-card>
</template>
  
<script>
export default {
    name: 'ChatView',
    props: [ 'user' ],
    data() {
        return {
            connection: null,
            message: '',
            history: []
        }
    },
    methods: {
        send() {
            this.connection.send(JSON.stringify({ event: 'CHAT', message: this.message }))
            this.message = ''
        }
    },
    mounted() {
        this.connection = new WebSocket('ws://' + window.location.host + '/websocket')
        this.connection.onopen = () => {
            console.log('Websocket connection established')
            setTimeout(() => 
                this.connection.send(JSON.stringify({ event: 'INIT', session: this.user.sessionid || null }))
            , 100)    
        }
        this.connection.onmessage = (event) => {
            let data = {}
            try {
                data = JSON.parse(event.data)
                data.timestamp = new Date(data.timestamp)
            } catch(err) {
                console.error('Broken WS data', event.data)
                return
            }
            console.log('WS data arrived',)
            switch(data.event) {
                case 'CHAT':
                    this.history.push(data)
                    break
            }
       }
    }    
}
</script>
  
<style scoped>
.foreign-message { text-align: left; }
.my-message { text-align: right; }
</style>