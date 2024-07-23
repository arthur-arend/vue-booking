export const formatRoomDetails = (room: { price: number; capacity: number }) => {
  return `R$ ${room.price} - ${room.capacity} pessoas`
}
