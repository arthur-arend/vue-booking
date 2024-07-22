<template>
  <v-app>
    <v-main>
      <v-row class="search_container">
        <v-col cols="8" sm="4" md="2">
          <v-select
            variant="outlined"
            label="Cidade"
            :items="cities"
            v-model="selectedCity"
          ></v-select>
        </v-col>
        <v-col cols="8" sm="4" md="2">
          <v-select
            variant="outlined"
            label="Hóspedes"
            :items="[1, 2, 3]"
            v-model="selectedGuests"
            class="small-select"
          ></v-select>
        </v-col>
        <v-col cols="8" sm="4" md="2">
          <v-select
            variant="outlined"
            label="Quartos"
            :items="[1, 2, 3]"
            v-model="selectedRooms"
          ></v-select>
        </v-col>
        <v-col cols="8" sm="4" md="3" class="search_date">
          <v-text-field
            variant="outlined"
            v-model="formattedDates"
            label="Período"
            type="text"
            readonly
            class="thin-text-field"
          ></v-text-field>
          <v-menu
            v-model:menu="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            @click:outside="handleMenuClose"
          >
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" size="x-large" color="#201E43">
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
        </v-col>
        <v-col cols="12" sm="12" md="2" class="search_cta">
          <v-btn class="search__cta" size="x-large" color="#201E43" @click="handleClick"
            >Pesquisar</v-btn
          >
        </v-col>
      </v-row>
      <v-container v-if="hotels.length > 0" class="container_info">
        <v-btn color="primary" @click="sortHotelsByStars">Ordenar</v-btn>
        <v-row v-for="hotel in hotels" :key="hotel.id">
          <HotelCard :hotel="hotel" />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useFilterValuesStore } from '../stores/filterValues'
import {
  VApp,
  VMain,
  VContainer,
  VBtn,
  VSelect,
  VMenu,
  VDatePicker,
  VTextField
} from 'vuetify/components'
import axios from 'axios'
import type { Hotel } from '../interfaces/hotels/hotels.model'
import { formatDate } from '../utils/date-time'
import HotelCard from '../components/Card/HotelCard.vue'

export default defineComponent({
  components: {
    VApp,
    VMain,
    VContainer,
    VBtn,
    VSelect,
    VMenu,
    VDatePicker,
    VTextField,
    HotelCard
  },
  setup() {
    const filterValuesStore = useFilterValuesStore() // Create a reference to the store
    const cities = ref([])
    const menu = ref(false)
    const hotels = ref<Hotel[]>([])
    const selectedCity = ref<any>(null)

    const today = computed(() => {
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    })

    const minCheckoutDate = computed(() => {
      if (filterValuesStore.checkInDate) {
        return filterValuesStore.checkInDate
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

    const formattedDates = computed(() => {
      if (filterValuesStore.checkInDate && filterValuesStore.checkOutDate) {
        return `${formatDate(filterValuesStore.checkInDate)} até ${formatDate(filterValuesStore.checkOutDate)}`
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
        hotels.value = filterRoomsByCapacity(response.data, filterValuesStore.selectedGuests || 0)
      } catch (error) {
        console.log(error)
      }
    }

    return {
      cities,
      menu,
      hotels,
      today,
      selectedCity,
      selectedGuests: computed({
        get: () => filterValuesStore.selectedGuests,
        set: (value: number | null) => filterValuesStore.setSelectedGuests(value)
      }),
      selectedRooms: computed({
        get: () => filterValuesStore.selectedRooms,
        set: (value: number | null) => filterValuesStore.setSelectedRooms(value)
      }),
      checkInDate: computed({
        get: () => filterValuesStore.checkInDate,
        set: (value: Date | null) => filterValuesStore.setCheckInDate(value)
      }),
      checkOutDate: computed({
        get: () => filterValuesStore.checkOutDate,
        set: (value: Date | null) => filterValuesStore.setCheckOutDate(value)
      }),
      formattedDates,
      minCheckoutDate,
      handleClick,
      sortHotelsByStars,
      handleMenuClose
    }
  }
})
</script>

<style scoped lang="scss">
.search_container {
  background-color: #eeeeee;
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;

  .search_date {
    padding: 0;
    display: flex;
    justify-content: center;

    .v-btn.v-btn--density-default {
      height: 55px;
    }
  }

  .search_cta {
    width: 100%;
    align-self: flex-end;
    button {
      height: 55px;
      margin-bottom: 23px;
    }
  }
}

.container_info {
  width: 100%;
  height: auto;
  padding: 0 0 2rem 1rem;

  margin-top: 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;

  v-row {
    width: 100%;
  }
}
</style>
