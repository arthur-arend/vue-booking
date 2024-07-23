import axios from 'axios'
import type { Hotel } from '../interfaces/hotels/hotels.model'

export const getHotelById = async (id: string): Promise<Hotel | null> => {
  try {
    const response = await axios.get('http://localhost:3001/hotels/', {
      params: { id }
    })
    return response.data[0]
  } catch (error) {
    console.error('Error fetching hotel:', error)
    return null
  }
}

export const makeReservation = async (payload: any): Promise<void> => {
  try {
    await axios.post('http://localhost:3001/shopping/', payload)
  } catch (error) {
    console.error('Error making reservation:', error)
    throw error
  }
}

export const fetchCities = async (): Promise<{ id: number; name: string }[]> => {
  try {
    const response = await axios.get('http://localhost:3001/cities')
    return response.data
  } catch (error) {
    console.error('Error fetching cities:', error)
    return []
  }
}

export const fetchHotels = async (location: string | null): Promise<Hotel[]> => {
  try {
    const response = await axios.get('http://localhost:3001/hotels', {
      params: { location }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return []
  }
}
