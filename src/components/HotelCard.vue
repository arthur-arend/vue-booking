<template>
  <v-row>
    <v-col cols="12" md="6" lg="4">
      <v-card class="card_container">
        <v-card-title class="card_container__title">
          {{ hotel.name }}
          <v-btn @click="handleLink" color="#201E43" class="text-xs">Reservar</v-btn>
        </v-card-title>
        <v-card-subtitle>Endereço: {{ hotel.address }}</v-card-subtitle>
        <v-card-text>
          <v-card-subtitle>Quartos</v-card-subtitle>
          <v-list lines="one">
            <v-list-item
              v-for="room in hotel.rooms"
              :key="room.id"
              :title="room.name"
              :subtitle="formatRoomDetails(room)"
            >
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-rating
          v-model="localStars"
          active-color="#201E43"
          color="#508C9B"
          density="comfortable"
          readonly
        ></v-rating>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Hotel } from '../interfaces/hotels/hotels.model'

const props = defineProps<{ hotel: Hotel }>()

const localStars = ref(props.hotel.stars)
const router = useRouter()

const handleLink = () => {
  router.push(`/about/${props.hotel.id}`)
}

const formatRoomDetails = (room: { price: number; capacity: number }) => {
  return `R$ ${room.price} - ${room.capacity} pessoas`
}
</script>

<style lang="scss" scoped>
.card_container {
  width: 100%;
  margin-bottom: 1rem;

  .card_container__title {
    display: flex;
    gap: 2rem;
  }
}

.v-card {
  box-shadow: none;
}

@media (max-width: 600px) {
  .card_container {
    width: 90%;
    margin: 0 auto;
  }

  .card_container__title {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
