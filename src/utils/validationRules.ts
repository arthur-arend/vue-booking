import type { Ref } from 'vue'

export const getRoomRules = (roomSelectionValid: Ref<boolean>) => [
  () => {
    if (roomSelectionValid.value) return true
    return 'Selecione ao menos um quarto.'
  }
]

export const getNameRules = () => [
  (value: string) => {
    if (value) return true
    return 'Nome é obrigatório.'
  }
]

export const getSelectedGuestsRules = (
  selectedGuests: Ref<number>,
  selectedRooms: Ref<{ [key: string]: number }>,
  hotel: Ref<any>
) => [
  (value: number) => {
    if (value > 0) return true
    return 'Número de hóspedes é obrigatório.'
  },
  () => {
    const totalCapacity = Object.keys(selectedRooms.value).reduce((total, roomId) => {
      const room = hotel.value?.rooms.find((r: any) => r.id.toString() === roomId.toString())
      if (room) {
        return total + room.capacity * selectedRooms.value[roomId]
      }
      return total
    }, 0)
    if (selectedGuests.value <= totalCapacity) return true
    return 'Número de hóspedes excede a capacidade dos quartos selecionados.'
  }
]

export const getDateRules = () => [
  (value: string) => {
    if (value) return true
    return 'Período é obrigatório.'
  }
]

export const getEmailRules = () => [
  (value: string) => {
    if (value) return true
    return 'E-mail é obrigatório.'
  },
  (value: string) => {
    if (/.+@.+\..+/.test(value)) return true
    return 'E-mail deve ser válido.'
  }
]

export const getPaymentMethodRules = () => [
  (value: string) => {
    if (value) return true
    return 'Meio de pagamento é obrigatório.'
  }
]
