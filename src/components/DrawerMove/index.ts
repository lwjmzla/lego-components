import { App } from "vue";
import DrawerMove from "./DrawerMove.vue";
DrawerMove.install = (app: App): void => {
  app.component(DrawerMove.name, DrawerMove);
};

export default DrawerMove;