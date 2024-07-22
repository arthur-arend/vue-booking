<template>
  <v-card class="card_container">
    <v-card-title>{{ props.hotel.name }}</v-card-title>
    <v-card-subtitle>{{ props.hotel.address }}</v-card-subtitle>
    <v-card-text>
      <v-list lines="one">
        <v-list-item
          v-for="room in props.hotel.rooms"
          :key="room.id"
          :title="room.name"
          :subtitle="`R$ ${room.price} - ${room.capacity} pessoas`"
        >
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-text>
      <p>{{ props.hotel.stars }} Estrelas</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { VCard, VCardTitle, VCardText, VCardSubtitle, VList } from 'vuetify/components'
import type { Hotel } from '../../interfaces/hotels/hotels.model'

const props = defineProps<{
  hotel: Hotel
}>()
</script>

<style scoped>
.card_container {
  max-width: 100%;
  width: 100%;
}

.v-card {
  box-shadow: none;
}
</style>
