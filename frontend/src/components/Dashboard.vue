<template>
    <v-card variant="text">
        <v-card-title>Dashboard</v-card-title>
        <v-card-text>
            <ProjectChart/>
        </v-card-text>
    </v-card>
</template>
  
<script>
import ProjectChart from './ProjectChart.vue'

export default {
    name: 'DashboardView',
    components: { ProjectChart },
    props: [ 'user' ]
}
</script>
  
<style scoped>
</style>