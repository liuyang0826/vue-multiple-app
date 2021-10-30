import connector from "@cisdiliuyang/vue-multiple-app/src/connector"
import App from "./App.vue";
import routerOption from "./router";
import storeModule from "./store";
import 'element-ui/lib/theme-chalk/index.css';

export default connector({
  App,
  routerOption,
  storeModule
});
