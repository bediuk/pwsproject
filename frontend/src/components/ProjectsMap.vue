<template>
  <div>
    <VMap ref="vmap" style="height: 500px;" :center="center" :zoom="zoom" @view-changed="onViewChanged" @click="onMapClick">
      <template v-for="(marker, index) in markers" :key="index">
        <VMapIconMarker ref="vmarker" v-model:latlng="markers[index]"
          :icon-url="require('leaflet/dist/images/marker-icon.png')"
          :icon-retina-url="require('leaflet/dist/images/marker-icon-2x.png')"
          :icon-shadow-url="require('leaflet/dist/images/marker-shadow.png')"
          :opacity="index == selected ? 1 : 0.5"
          @mousedown="onMarkerClick(marker, index)"
        ></VMapIconMarker>
      </template>
      <VMapOsmTileLayer/>
      <VMapZoomControl/>
    </VMap>

    <hr/>

    <v-row>
      <v-col>
        <v-text-field variant="solo" label="Center latitude" type="number" v-model="center.lat" @update:modelValue="onCenterChange"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" label="Center longitude" type="number" v-model="center.lng" @update:modelValue="onCenterChange"></v-text-field>
      </v-col>
      <v-col>
        <v-select variant="solo" label="Place"
          v-model="selected"
          :items="markers.map((item, index) => ({ value: index, title: item.title }))"
        >
        </v-select>
      </v-col>
    </v-row>
  </div>
</template>
    
<script>
// import styles of vue-map-ui
import 'leaflet/dist/leaflet.css'
import 'vue-map-ui/dist/normalize.css'
import 'vue-map-ui/dist/style.css'
import 'vue-map-ui/dist/theme-all.css'

import { VMap, VMapOsmTileLayer, VMapZoomControl, VMapIconMarker } from 'vue-map-ui'

export default {
  name: 'ProjectsMap',
  components: { VMap, VMapOsmTileLayer, VMapZoomControl, VMapIconMarker },
  data() {
    return {
      center: { lat: 51.773765, lng: 19.485026 },
      zoom: 15,
      markers: [ 
        { lat: 51.778645, lng: 19.495462, title: 'Dormitory' },
        { lat: 51.772653, lng: 19.474785, title: 'Rectorate' },
        { lat: 51.776765, lng: 19.487026, title: 'Faculty' }
      ],
      selected: 0
    }
  },
  methods: {
    onMapClick(clickPos) {
      console.log(clickPos.latlng)
    },
    onCenterChange() {
      this.$refs.vmap.map.panTo(this.center)
    },
    onMarkerClick(marker, index) {
      console.log(marker)
      this.selected = index
    },
    onViewChanged(event) {
      this.center = event.center
    }
  },
  mounted() {
  }
}
</script>
    
<style scoped>
</style>
    