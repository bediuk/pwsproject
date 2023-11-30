<template>
  <v-app>
    
    <v-navigation-drawer expand-on-hover rail permanent>
      
      <v-list density="compact" nav>
        <template v-for="item in navigation" :key="item.title">
          <v-list-item :href="item.href" :prepend-icon="item.icon" :title="item.title" exact/>
        </template>
      </v-list>

      <v-divider></v-divider>

      <div>{{ user.username || 'not-logged-in' }}</div>
      <div v-if="!user.username">
        <v-text-field variant="solo" label="Username" v-model="creds.username"></v-text-field>
        <v-text-field variant="solo" type="password" label="Password" v-model="creds.password"></v-text-field>
        <v-btn @click="login">Login</v-btn>
      </div>
      <div v-if="user.username">
        <v-btn @click="logout">Logout</v-btn>
      </div>

    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>

  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      navigation: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', href: '#/' },
          { title: 'Persons', icon: 'mdi-account-multiple', href: '#/persons' },
          { title: 'Projects', icon: 'mdi-sitemap-outline', href: '#/projects' }
      ],
      user: {},
      creds: {}
    }
  },
  methods: {
    logout() {
      fetch('/auth', { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        this.user = data
      })
    },
    login() {
      fetch('/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.creds) })
      .then(res => res.json())
      .then(data => {
        this.user = data
      })
    }
  },
  mounted() {
    fetch('/auth', { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      this.user = data
    })
  }
}
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 10px 30px;
}
</style>