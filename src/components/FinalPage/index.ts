import {App} from 'vue'
import FinalPage from './FinalPage.vue'

FinalPage.install = (app: App) => {
  app.component(FinalPage.name, FinalPage)
}

export default FinalPage