import { Tooltip, VTooltip } from 'floating-vue'
import { type UserModule } from '~/types'
import 'floating-vue/dist/style.css'

export const install: UserModule = ({ app }) => {
  app.directive('tooltip', VTooltip)
  app.component('VTooltip', Tooltip)
}

