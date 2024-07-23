<template>
  <v-text-field
    variant="outlined"
    v-model="computedFormattedDates"
    label="Período"
    type="text"
    readonly
    class="thin-text-field"
  ></v-text-field>
  <v-menu
    v-model="menu"
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
          v-model="localCheckInDate"
          :min="today"
          elevation="24"
          title="Check-in"
        ></v-date-picker>
      </v-col>
      <v-col>
        <v-date-picker
          v-model="localCheckOutDate"
          :min="minCheckoutDate"
          elevation="24"
          title="Check-out"
        ></v-date-picker>
      </v-col>
    </v-row>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { VCol, VTextField, VMenu, VBtn, VIcon, VRow, VDatePicker } from 'vuetify/components'
import { formatDate } from '../utils/date-time'

export default defineComponent({
  components: {
    VCol,
    VTextField,
    VMenu,
    VBtn,
    VIcon,
    VRow,
    VDatePicker
  },
  props: {
    checkInDate: {
      type: Date,
      required: true
    },
    checkOutDate: {
      type: Date,
      required: true
    },
    today: {
      type: String,
      required: true
    },
    minCheckoutDate: {
      type: String,
      required: true
    },
    formattedDates: {
      type: String,
      required: true
    },
    handleMenuClose: {
      type: Function,
      required: true
    }
  },
  emits: ['update:checkInDate', 'update:checkOutDate'],
  setup(props, { emit }) {
    const menu = ref(false)
    const localCheckInDate = ref<Date | null>(props.checkInDate)
    const localCheckOutDate = ref<Date | null>(props.checkOutDate)

    watch(localCheckInDate, (newDate) => {
      if (newDate) emit('update:checkInDate', newDate)
    })

    watch(localCheckOutDate, (newDate) => {
      if (newDate) emit('update:checkOutDate', newDate)
    })

    const computedFormattedDates = computed(() => {
      if (localCheckInDate.value && localCheckOutDate.value) {
        return `${formatDate(localCheckInDate.value)} até ${formatDate(localCheckOutDate.value)}`
      }
      return ''
    })

    return {
      menu,
      localCheckInDate,
      localCheckOutDate,
      computedFormattedDates
    }
  }
})
</script>

<style scoped></style>
