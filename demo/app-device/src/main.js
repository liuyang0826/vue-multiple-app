import connector from "@cisdiliuyang/vue-multiple-app/connector";
import App from "./App.vue";
import routerOption from "./router";
import storeModule from "./store";

export default connector({
  App,
  routerOption,
  storeModule
});
