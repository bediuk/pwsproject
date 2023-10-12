<template>
  <v-card class="box" variant="outlined">
    <v-card-title>Test Component</v-card-title>
    <v-card-text>
      <v-form v-model="isPersonValid">
        <v-text-field variant="solo" label="First name" v-model="person.firstName" :rules="[ rules.required ]"></v-text-field>
        <v-text-field variant="solo" label="Last name" v-model="person.lastName" :rules="[ rules.required ]"></v-text-field>
        <v-text-field variant="solo" label="Year of birth" type="number" v-model="person.yearOfBirth" :rules="[ rules.required, rules.fourDigits ]"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions class="actions">
      <v-btn variant="elevated" color="primary" @click="action" :disabled="!isPersonValid">Action</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'TestComponent',
  mounted: () => console.log('TestComponent mounted'),
  methods: {
    action() {
      this.person.yearOfBirth = parseInt(this.person.yearOfBirth)
      console.log('Action was performed on person', this.person)
    }
  },
  data() {
    return {
      isPersonValid: false,
      rules: {
        required: value => !!value || 'empty value is not allowed',
        fourDigits: value => /^\d\d\d\d$/.test(value) || 'enter four digits'
      },
      person: {
        firstName: '',
        lastName: '',
        yearOfBirth: 1900
      }     
    }
  } 
}
</script>

<style scoped>
.box {
  width: 400px;
}
</style>
