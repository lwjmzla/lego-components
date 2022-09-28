import {App} from 'vue'
import LText from './components/LText'
import LImage from './components/LImage'
import LShape from './components/LShape'
import FinalPage from './components/FinalPage'
const components = [ 
  LText,
  LImage,
  LShape,
  FinalPage
]

const install = (app: App) => { 
  components.map(component => {
    app.use(component)
  })
}

// !这种导出，通过webpack引入的话支持tree-shaking么，感觉不支持。
export { 
  //install,
  LText,
  LImage,
  LShape,
  FinalPage
}

// export default {
//   install
// }
export default install