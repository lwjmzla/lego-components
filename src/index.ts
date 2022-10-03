import {App} from 'vue'
import {version} from '../package.json'
import LText from './components/LText'
import LImage from './components/LImage'
import LShape from './components/LShape'
import FinalPage from './components/FinalPage'
import DrawerMove from './components/DrawerMove'
const components = [ 
  LText,
  LImage,
  LShape,
  FinalPage,
  DrawerMove
]

const install = (app: App) => { 
  components.map(component => {
    app.use(component)
  })
}

// !这种导出，通过webpack引入的话支持tree-shaking么，感觉不支持。
export { 
  install,
  LText,
  LImage,
  LShape,
  FinalPage,
  DrawerMove
}

export default {
  version,
  install,
}

declare module 'vue' {
  export interface GlobalComponents {
    LText: typeof LText;
    LImage: typeof LImage;
    LShape: typeof LShape;
    FinalPage: typeof FinalPage;
    DrawerMove: typeof DrawerMove;
  }
}