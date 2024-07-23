<template>
  <v-app>
    <v-main>
      <v-row class="search_container">
        <v-col cols="8" sm="4" md="2">
          <v-select
            variant="outlined"
            label="Cidade"
            :items="cityNames"
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
          <DatePickerComponent
            :check-in-date="checkInDate"
            :check-out-date="checkOutDate"
            :today="today"
            :min-checkout-date="minCheckoutDate"
            :formatted-dates="formattedDates"
            :handle-menu-close="handleMenuClose"
            @update:checkInDate="updateCheckInDate"
            @update:checkOutDate="updateCheckOutDate"
          />
        </v-col>
        <v-col cols="8" md="2" class="search_cta">
          <v-btn
            class="search__cta"
            size="x-large"
            color="#201E43"
            @click="handleClick"
            :disabled="!selectedCity"
            >Pesquisar</v-btn
          >
        </v-col>
      </v-row>
      <v-row v-if="hotels.length !== 0" class="container_info">
        <v-btn
          @click="sortHotelsByStars"
          size="x-large"
          color="#201E43"
          class="container_info__button"
          >Ordenar</v-btn
        >
        <v-col cols="12">
          <div class="card-wrapper">
            <HotelCard v-for="hotel in hotels" :key="hotel.id" :hotel="hotel" />
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { VApp, VMain, VBtn, VSelect } from 'vuetify/components'
import { useFilterValuesStore } from '../stores/filterValues'
import { useHotelsStore } from '../stores/hotelsStore'
import type { Hotel } from '../interfaces/hotels/hotels.model'
import { formatDate } from '../utils/date-time'
import HotelCard from '../components/HotelCard.vue'
import DatePickerComponent from '../components/DatePickerComponent.vue'
import { fetchCities, fetchHotels } from '../services/apiService'

export default defineComponent({
  components: {
    VApp,
    VMain,
    VBtn,
    VSelect,
    HotelCard,
    DatePickerComponent
  },
  setup() {
    const filterValuesStore = useFilterValuesStore()
    const hotelsStore = useHotelsStore()
    const cities = ref<{ id: number; name: string }[]>([])
    const menu = ref(false)
    const selectedCity = computed({
      get: () => filterValuesStore.getSelectedCity,
      set: (value: string | null) => filterValuesStore.setSelectedCity(value)
    })

    const hotels = computed(() => hotelsStore.hotels)

    const today = computed<string>(() => {
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    })

    const minCheckoutDate = computed<string>(() => {
      return filterValuesStore.getCheckInDate
        ? formatDate(filterValuesStore.getCheckInDate)
        : today.value
    })

    const loadCities = async () => {
      cities.value = await fetchCities()
    }

    onMounted(() => {
      loadCities()
    })

    const cityNames = computed(() => cities.value.map((city) => city.name))

    const sortHotelsByStars = () => {
      hotelsStore.hotels = [...hotelsStore.hotels].sort((a, b) => b.stars - a.stars)
    }

    const formattedDates = computed(() => {
      if (filterValuesStore.getCheckInDate && filterValuesStore.getCheckOutDate) {
        return `${formatDate(filterValuesStore.getCheckInDate)} até ${formatDate(filterValuesStore.getCheckOutDate)}`
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
        const response = await fetchHotels(selectedCity.value)
        const filteredHotels = filterRoomsByCapacity(
          response,
          filterValuesStore.getSelectedGuests || 0
        )
        hotelsStore.setHotels(filteredHotels)
      } catch (error) {
        console.error('Error fetching hotels:', error)
      }
    }

    const updateCheckInDate = (date: Date) => {
      filterValuesStore.setCheckInDate(date)
    }

    const updateCheckOutDate = (date: Date) => {
      filterValuesStore.setCheckOutDate(date)
    }

    return {
      cities,
      cityNames,
      menu,
      hotels,
      today,
      selectedCity,
      selectedGuests: computed({
        get: () => filterValuesStore.getSelectedGuests,
        set: (value: number | null) => filterValuesStore.setSelectedGuests(value)
      }),
      selectedRooms: computed({
        get: () => filterValuesStore.getSelectedRooms,
        set: (value: number | null) => filterValuesStore.setSelectedRooms(value)
      }),
      checkInDate: computed({
        get: () => filterValuesStore.getCheckInDate as Date,
        set: (value: Date) => filterValuesStore.setCheckInDate(value)
      }),
      checkOutDate: computed({
        get: () => filterValuesStore.getCheckOutDate as Date,
        set: (value: Date) => filterValuesStore.setCheckOutDate(value)
      }),
      formattedDates,
      minCheckoutDate,
      handleClick,
      sortHotelsByStars,
      handleMenuClose,
      updateCheckInDate,
      updateCheckOutDate
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
}

.card-wrapper {
  width: 100%;
}

.card_container {
  width: 100%;
  margin-bottom: 1rem;

  .card_container__title {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
  }
}

.v-card {
  box-shadow: none;
  width: 100%;
}

/* Media queries */
@media (max-width: 600px) {
  .card_container {
    .card_container__title {
      flex-direction: column;
      gap: 1rem;
    }
  }
}
</style>
