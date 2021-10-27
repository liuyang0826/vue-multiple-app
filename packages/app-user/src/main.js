import App from "./App.vue";
import routerOption from "./router-option";
import connector from "../../../src/connector"

export default connector({
  App,
  routerOption,
  storeModule: {
    state () {
      return {
        deviceList: [
          {
            name: "dsdasda"
          }
        ]
      };
    }
  }
});
