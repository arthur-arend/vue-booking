<template>
  <v-app>
    <v-main v-if="hotel">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="order__container">
              <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
                <v-card-title> Revisar Pedido </v-card-title>
                <v-card-subtitle>Hotel: {{ hotel.name }}</v-card-subtitle>
                <v-card-subtitle>Endereço: {{ hotel.address }}</v-card-subtitle>
                <v-col cols="8" md="12">
                  <v-text-field
                    v-model="selectedGuests"
                    :rules="selectedGuestsRules"
                    label="Hóspedes"
                    required
                    append-inner-icon="mdi-plus"
                    @click:append-inner="incrementCounter"
                    prepend-inner-icon="mdi-minus"
                    @click:prepend-inner="deductCounter"
                  ></v-text-field>
                </v-col>
                <v-col cols="8" md="12">
                  <v-card-subtitle>Quartos</v-card-subtitle>
                  <v-list lines="one">
                    <v-list-item
                      v-for="(room, index) in hotel.rooms"
                      :key="room.id"
                      :title="room.name"
                      :subtitle="formatRoomDetails(room)"
                      class="room-list-item"
                    >
                      <template v-slot:append>
                        <v-text-field
                          v-model="roomCounters[index]"
                          type="number"
                          class="room-counter"
                          dense
                          :rules="roomRules"
                          prepend-inner-icon="mdi-minus"
                          @click:prepend-inner="decrementRoomCounter(index)"
                          append-inner-icon="mdi-plus"
                          @click:append-inner="incrementRoomCounter(index)"
                        ></v-text-field>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="8" md="12">
                  <v-text-field
                    variant="outlined"
                    v-model="formattedDates"
                    :rules="dateRules"
                    label="Período"
                    type="text"
                    readonly
                    class="thin-text-field"
                    ref="dateTextField"
                  ></v-text-field>
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    attach="#dateTextField"
                    @click:outside="handleMenuClose"
                  >
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" size="x-large" color="#201E43">
                        <v-icon icon="mdi-calendar" start></v-icon>
                      </v-btn>
                    </template>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-date-picker
                          v-model="checkInDate"
                          :min="today"
                          elevation="24"
                          title="Check-in"
                          width="250px"
                          min-width="250px"
                          dense
                        ></v-date-picker>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-date-picker
                          v-model="checkOutDate"
                          :min="minCheckoutDate"
                          elevation="24"
                          title="Check-out"
                          width="250px"
                          min-width="250px"
                          dense
                        ></v-date-picker>
                      </v-col>
                    </v-row>
                  </v-menu>
                </v-col>
                <v-card-title class="order__container_totalValue">
                  Total: R$ {{ total }}</v-card-title
                >
              </v-form>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-form ref="form" v-model="valid" @submit.prevent="onSubmit" class="user__container">
                <v-card-title> Dados Pessoais </v-card-title>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="name"
                    :counter="10"
                    :rules="nameRules"
                    label="Nome Completo"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-select
                    :items="['Cartão de crédito', 'Depósito bancário', 'Pix']"
                    v-model="paymentMethod"
                    :rules="paymentMethodRules"
                    label="Meio de pagamento"
                    required
                  ></v-select>
                </v-col>
                <v-btn color="#201E43" type="submit"> Reservar </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" top>
          {{ snackbarMessage }}
          <v-btn color="red" @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import type { Hotel } from '../interfaces/hotels/hotels.model'
import {
  VApp,
  VMain,
  VCard,
  VCardTitle,
  VCardSubtitle,
  VList,
  VListItem,
  VBtn,
  VTextField,
  VForm,
  VSelect,
  VSnackbar
} from 'vuetify/components'
import { useRoute, useRouter } from 'vue-router'
import { useFilterValuesStore } from '../stores/filterValues'
import { useHotelsStore } from '../stores/hotelsStore'
import { formatRoomDetails } from '../utils/formatters'
import { formatDate } from '../utils/date-time'
import {
  getRoomRules,
  getNameRules,
  getSelectedGuestsRules,
  getDateRules,
  getEmailRules,
  getPaymentMethodRules
} from '../utils/validationRules'
import { getHotelById, makeReservation } from '../services/apiService' // Import the service functions

export default defineComponent({
  components: {
    VApp,
    VMain,
    VCard,
    VCardTitle,
    VCardSubtitle,
    VList,
    VListItem,
    VBtn,
    VTextField,
    VForm,
    VSelect,
    VSnackbar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const hotel = ref<Hotel | null>(null)
    const filterValuesStore = useFilterValuesStore()
    const hotelsStore = useHotelsStore()

    const form = ref<any>(null)
    const menu = ref(false)
    const valid = ref(false)
    const name = ref('')
    const email = ref('')
    const selectedGuests = ref<number>(filterValuesStore.getSelectedGuests || 0)
    const selectedRooms = ref<{ [key: string]: number }>({})
    const paymentMethod = ref<string | null>(null)
    const roomCounters = ref<number[]>([])

    const snackbar = ref(false)
    const snackbarMessage = ref('')
    const snackbarTimeout = ref(5000)

    const roomSelectionValid = computed(() => {
      return Object.keys(selectedRooms.value).length > 0
    })

    const roomRules = getRoomRules(roomSelectionValid)
    const nameRules = getNameRules()
    const selectedGuestsRules = getSelectedGuestsRules(selectedGuests, selectedRooms, hotel)
    const dateRules = getDateRules()
    const emailRules = getEmailRules()
    const paymentMethodRules = getPaymentMethodRules()

    const fetchHotel = async () => {
      const hotelId = route.params.id as string
      hotel.value = await getHotelById(hotelId)
    }

    const formattedDates = computed(() => {
      if (filterValuesStore.getCheckInDate && filterValuesStore.getCheckOutDate) {
        return `${formatDate(filterValuesStore.getCheckInDate)} até ${formatDate(filterValuesStore.getCheckOutDate)}`
      }
      return ''
    })

    const today = computed(() => {
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    })

    const minCheckoutDate = computed(() => {
      return filterValuesStore.getCheckInDate || today.value
    })

    const incrementRoomCounter = (index: number) => {
      const roomId = hotel.value?.rooms[index].id
      if (roomId) {
        selectedRooms.value[roomId] = (selectedRooms.value[roomId] || 0) + 1
        roomCounters.value[index] = selectedRooms.value[roomId]
      }
    }

    const decrementRoomCounter = (index: number) => {
      const roomId = hotel.value?.rooms[index].id
      if (roomId && selectedRooms.value[roomId] > 0) {
        selectedRooms.value[roomId]--
        if (selectedRooms.value[roomId] === 0) {
          delete selectedRooms.value[roomId]
        }
        roomCounters.value[index] = selectedRooms.value[roomId] || 0
      }
    }

    const handleMenuClose = () => {
      menu.value = false
    }

    const onSubmit = async () => {
      if (form.value.validate()) {
        const payload = {
          shopping: [
            {
              user: {
                name: name.value,
                email: email.value
              },
              item: {
                hotelName: hotel.value?.name,
                checkInDate: filterValuesStore.getCheckInDate,
                checkOutDate: filterValuesStore.getCheckOutDate,
                roomsBooked: Object.keys(selectedRooms.value).map((roomId) => ({
                  roomId: parseInt(roomId),
                  quantity: selectedRooms.value[roomId]
                })),
                guests: selectedGuests.value,
                paymentMethod: paymentMethod.value
              }
            }
          ]
        }

        try {
          await makeReservation(payload)
          snackbarMessage.value = 'Reserva realizada com sucesso!'
          snackbar.value = true
        } catch (error) {
          console.error('Error:', error)
          snackbarMessage.value = 'Erro ao realizar a reserva. Tente novamente.'
          snackbar.value = true
        }
      }
    }

    const total = computed(() => {
      const checkInDate = filterValuesStore.getCheckInDate
      const checkOutDate = filterValuesStore.getCheckOutDate

      if (!checkInDate || !checkOutDate) {
        return 0
      }

      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        return 0
      }

      const totalRoomsCost = Object.keys(selectedRooms.value).reduce((total, roomId) => {
        const roomCount = selectedRooms.value[roomId] || 0
        const room = hotel.value?.rooms.find((r: { id: number }) => r.id === parseInt(roomId))
        const roomCost = room ? room.price : 0
        return total + roomCount * roomCost
      }, 0)

      return diffDays * totalRoomsCost
    })

    onMounted(() => {
      fetchHotel()
      roomCounters.value = Array(hotel.value?.rooms.length || 10).fill(0)
    })

    const incrementCounter = () => {
      selectedGuests.value++
    }

    const deductCounter = () => {
      if (selectedGuests.value > 0) {
        selectedGuests.value--
      }
    }

    if (
      filterValuesStore.getSelectedGuests === null ||
      filterValuesStore.getSelectedGuests === undefined
    ) {
      filterValuesStore.setSelectedGuests(0)
    }

    watch(snackbar, (newValue) => {
      if (!newValue) {
        filterValuesStore.setCheckInDate(null)
        filterValuesStore.setCheckOutDate(null)
        filterValuesStore.setSelectedGuests(null)
        filterValuesStore.setSelectedRooms(null)
        filterValuesStore.setSelectedCity(null)
        hotelsStore.setHotels([])
        router.push('/')
      }
    })

    return {
      hotel,
      valid,
      form,
      name,
      nameRules,
      email,
      emailRules,
      today,
      formatRoomDetails,
      selectedGuests,
      selectedGuestsRules,
      incrementCounter,
      deductCounter,
      roomCounters,
      incrementRoomCounter,
      decrementRoomCounter,
      roomRules,
      selectedRooms,
      menu,
      handleMenuClose,
      minCheckoutDate,
      checkInDate: computed({
        get: () => filterValuesStore.getCheckInDate,
        set: (value: Date | null) => filterValuesStore.setCheckInDate(value)
      }),
      checkOutDate: computed({
        get: () => filterValuesStore.getCheckOutDate,
        set: (value: Date | null) => filterValuesStore.setCheckOutDate(value)
      }),
      dateRules,
      paymentMethod,
      paymentMethodRules,
      onSubmit,
      total,
      snackbar,
      snackbarMessage,
      snackbarTimeout,
      formattedDates
    }
  }
})
</script>

<style lang="scss">
.user__container {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}
</style>
