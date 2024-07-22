<template>
  <v-app>
    <v-main>
      <v-row class="search_container">
        <v-col cols="12" sm="6" md="2">
          <v-select
            variant="outlined"
            label="Cidade"
            :items="cities"
            v-model="selectedCity"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-select
            variant="outlined"
            label="Hóspedes"
            :items="[1, 2, 3]"
            v-model="selectedGuests"
            class="small-select"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-select variant="outlined" label="Quartos" :items="[1, 2, 3]"></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="date__container">
          <v-text-field
            variant="outlined"
            v-model="formattedDates"
            label="Período"
            type="text"
            readonly
            class="thin-text-field"
          >
            <template v-slot:append>
              <v-menu
                v-model:menu="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                @click:outside="handleMenuClose"
              >
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" size="x-large" color="primary">
                    <v-icon icon="mdi-calendar" start></v-icon>
                  </v-btn>
                </template>
                <v-row>
                  <v-col>
                    <v-date-picker
                      v-model="checkInDate"
                      :min="today"
                      elevation="24"
                      title="Check-in"
                    ></v-date-picker>
                  </v-col>
                  <v-col>
                    <v-date-picker
                      v-model="checkOutDate"
                      :min="minCheckoutDate"
                      elevation="24"
                      title="Check-out"
                    ></v-date-picker>
                  </v-col>
                </v-row>
              </v-menu>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-btn size="x-large" color="primary" @click="handleClick" :disabled="!isCitySelected"
            >Pesquisar</v-btn
          >
        </v-col>
      </v-row>
      <v-container v-if="hotels.length > 0">
        <v-row>
          <v-btn color="primary" @click="sortHotelsByStars">Ordenar</v-btn>
        </v-row>

        <v-row v-for="hotel in hotels" :key="hotel.id" cols="12" md="4">
          <v-card>
            <v-card-title>{{ hotel.name }}</v-card-title>
            <v-expansion-panels>
              <v-expansion-panel title="Quartos">
                <ul>
                  <li v-for="room in hotel.rooms" :key="room.id">
                    {{ room.name }} - R$ {{ room.price }}
                  </li>
                </ul>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-card-text>
              <p>{{ hotel.stars }} Estrelas</p>
            </v-card-text>
          </v-card>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import {
  VApp,
  VMain,
  VContainer,
  VBtn,
  VSelect,
  VMenu,
  VDatePicker,
  VCard,
  VTextField
} from 'vuetify/components'
import axios from 'axios'
import type { Hotel, Room } from '../interfaces/hotels/hotels.model'

export default defineComponent({
  components: {
    VApp,
    VMain,
    VContainer,
    VBtn,
    VSelect,
    VMenu,
    VDatePicker,
    VCard,
    VTextField
  },
  setup() {
    const cities = ref([])
    const menu = ref(false)
    const selectedCity = ref<string | null>(null)
    const hotels = ref<Hotel[]>([])
    const selectedGuests = ref()

    const checkInDate = ref<Date | null>(null)
    const checkOutDate = ref<Date | null>(null)

    const today = computed(() => {
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    })

    const minCheckoutDate = computed(() => {
      if (checkInDate.value) {
        return checkInDate.value
      }
      return today.value
    })

    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:3001/cities')
        cities.value = response.data
      } catch (error) {
        console.log(error)
      }
    }

    fetchCities()

    const sortHotelsByStars = () => {
      hotels.value = [...hotels.value].sort((a, b) => b.stars - a.stars)
    }

    const formatDate = (date: Date | null) => {
      if (date === null) return ''
      const [year, month, day] = date.toISOString().split('T')[0].split('-')
      return `${day}-${month}-${year}`
    }

    const formattedDates = computed(() => {
      if (checkInDate.value && checkOutDate.value) {
        return `${formatDate(checkInDate.value)} até ${formatDate(checkOutDate.value)}`
      }
      return ''
    })

    const handleMenuClose = () => {
      menu.value = false
    }

    const filterRoomsByCapacity = (hotels: Hotel[], minCapacity: number | string) => {
      if (typeof minCapacity === 'number' && !isNaN(minCapacity)) {
        return hotels
          .map((hotel) => ({
            ...hotel,
            rooms: hotel.rooms.filter((room) => room.capacity >= minCapacity)
          }))
          .filter((hotel) => hotel.rooms.length > 0)
      }
      return hotels
    }

    const handleClick = async () => {
      try {
        const response = await axios.get('http://localhost:3001/hotels', {
          params: {
            location: selectedCity.value
          }
        })
        hotels.value = filterRoomsByCapacity(response.data, selectedGuests.value)
      } catch (error) {
        console.log(error)
      }
    }
    const isCitySelected = computed(() => {
      return selectedCity.value !== null && selectedCity.value.trim() !== ''
    })

    return {
      cities,
      menu,
      selectedCity,
      hotels,
      checkInDate,
      checkOutDate,
      handleClick,
      sortHotelsByStars,
      formattedDates,
      handleMenuClose,
      today,
      minCheckoutDate,
      isCitySelected,
      selectedGuests
    }
  }
})
</script>

<style lang="scss">
.search_container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.date__container {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .thin-text-field .v-input__control {
    width: 100%;
    height: 80%;
  }
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
