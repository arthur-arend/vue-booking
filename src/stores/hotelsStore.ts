import { defineStore } from 'pinia'
import type { Hotel } from '../interfaces/hotels/hotels.model'

export const useHotelsStore = defineStore('hotels', {
  state: () => ({
    hotels: [] as Hotel[]
  }),
  actions: {
    setHotels(hotels: Hotel[]) {
      this.hotels = [...hotels]
    }
  }
})
