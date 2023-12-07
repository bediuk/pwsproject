<template>
  <v-app>
    
    <v-navigation-drawer expand-on-hover rail permanent>
      
      <v-list density="compact" nav>
        <template v-for="item in navigation" :key="item.title">
          <v-list-item :href="item.href" :prepend-icon="item.icon" :title="item.title" exact/>
        </template>
      </v-list>

      <v-divider></v-divider>

      <v-list v-if="user.username">
        <v-list-item
          :prepend-avatar="require('./assets/user.png')"
          :title="user.username"
        >
        </v-list-item>
      </v-list>

      <v-list density="compact" nav>
        <v-list-item key="Login" @click="loginDialog = true" prepend-icon="mdi-login" title="Login" exact v-if="!user.username"/>
        <v-list-item key="Logout" @click="logoutConfirmation = true" prepend-icon="mdi-logout" title="Logout" exact v-if="user.username"/>
      </v-list>

    </v-navigation-drawer>

    <v-main>
      <router-view :user="user"></router-view>
    </v-main>

    <v-dialog v-model="loginDialog" width="25em">
      <Login @cancel="loginDialog = false" @loginFailed="loginDialog = false" @loginSuccess="login"/>
    </v-dialog>

    <v-dialog v-model="logoutConfirmation" width="auto">
      <ConfirmationDialog :question="'Are you sure to logout?'" @ok="logout" @cancel="logoutConfirmation = false"/>
    </v-dialog>

  </v-app>
</template>

<script>
import Login from './components/Login.vue'
import ConfirmationDialog from './components/ConfirmationDialog.vue'

export default {
  name: 'App',
  components: { Login, ConfirmationDialog },
  data() {
    return {
      navigation: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', href: '#/' },
          { title: 'Persons', icon: 'mdi-account-multiple', href: '#/persons' },
          { title: 'Projects', icon: 'mdi-sitemap-outline', href: '#/projects' }
      ],
      user: {},
      loginDialog: false,
      logoutConfirmation: false
    }
  },
  methods: {
    setUser(data) {
      Object.keys(this.user).forEach(key => delete this.user[key])
      Object.assign(this.user, data)
    },
    logout() {
      this.logoutConfirmation = false
      fetch('/auth', { method: 'DELETE' })
      .then(res => res.json())
      .then(data => this.setUser(data))
    },
    login(data) {
      this.loginDialog = false
      this.setUser(data)
    }
  },
  mounted() {
    fetch('/auth', { method: 'GET' })
    .then(res => res.json())
    .then(data => this.setUser(data))
  }
}
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 10px 30px;
}
</style>