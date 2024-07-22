import { defineStore } from 'pinia'

export const useFilterValuesStore = defineStore('filterValues', {
  state: () => ({
    selectedGuests: null as number | null,
    checkInDate: null as Date | null,
    checkOutDate: null as Date | null,
    selectedRooms: null as number | null
  }),
  actions: {
    setSelectedGuests(guests: number | null) {
      this.selectedGuests = guests
    },
    setCheckInDate(date: Date | null) {
      this.checkInDate = date
    },
    setCheckOutDate(date: Date | null) {
      this.checkOutDate = date
    },
    setSelectedRooms(rooms: number | null) {
      this.selectedRooms = rooms
    }
  },
  getters: {
    getSelectedGuests: (state) => state.selectedGuests,
    getCheckInDate: (state) => state.checkInDate,
    getCheckOutDate: (state) => state.checkOutDate,
    getSelectedRooms: (state) => state.selectedRooms
  }
})
