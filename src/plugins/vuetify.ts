import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createVuetify } from 'vuetify'
import { pt } from 'vuetify/locale'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const customPt = {
  ...pt,
  datePicker: {
    ...pt.datePicker,
    title: 'Selecione a data'
  }
}

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'pt-BR',
    messages: { 'pt-BR': customPt }
  }
})

export default vuetify
