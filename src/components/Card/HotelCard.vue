<template>
  <v-card>
    <v-card-title>{{ props.hotel.name }}</v-card-title>
    <v-expansion-panels>
      <v-expansion-panel>
        <ul>
          <li v-for="room in props.hotel.rooms" :key="room.id">
            {{ room.name }} - R$ {{ room.price }}
          </li>
        </ul>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-text>
      <p>{{ props.hotel.stars }} Estrelas</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { VCard, VCardTitle, VExpansionPanels, VExpansionPanel, VCardText } from 'vuetify/components'
import type { Hotel } from '../../interfaces/hotels/hotels.model'

const props = defineProps<{
  hotel: Hotel
}>()

console.log('Filho', props.hotel)
</script>

<style scoped></style>
