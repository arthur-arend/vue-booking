<template>
  <v-app>
    <v-main>
      <v-container>
        <v-select label="Cidade" :items="cities"></v-select>
        <v-select
          label="Hóspedes"
          :items="['Uma pessoa', 'Duas pessoas', 'Três pessoas']"
        ></v-select>
        <v-btn color="primary">Pesquisar</v-btn>
        <v-menu
          v-model:menu="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template #activator="{ props }">
            <v-btn v-bind="props">Open Menu</v-btn>
          </template>

          <v-date-picker elevation="24" title="Check-in"></v-date-picker>
          <v-date-picker elevation="24" title="Check-out"> </v-date-picker>
        </v-menu>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { VApp, VMain, VContainer, VBtn, VSelect, VMenu, VDatePicker } from 'vuetify/components'
import axios from 'axios'

export default defineComponent({
  components: {
    VApp,
    VMain,
    VContainer,
    VBtn,
    VSelect,
    VMenu,
    VDatePicker
  },
  setup() {
    const cities = ref([])
    const menu = ref(false)

    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:3001/cities')
        cities.value = response.data
      } catch (error) {
        console.log(error)
      }
    }

    fetchCities()

    return {
      cities,
      menu
    }
  }
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
