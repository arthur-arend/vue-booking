export interface Room {
  id: number
  name: string
  capacity: number
  price: number
}

export interface Hotel {
  id: number
  name: string
  rooms: Room[]
  location: string
  address: string
  stars: number
}
