// Styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createVuetify } from 'vuetify'
import ptBR from '../locales/pt-br'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  locale: {
    locale: 'pt-BR',
    messages: {
      'pt-BR': ptBR
    }
  }
})
