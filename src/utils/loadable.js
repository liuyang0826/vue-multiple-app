import Vue from "vue";
import VueRouter from "vue-router";

const moduleNameMap = new Map();

const loader = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.onload = () => {
      resolve();
    };
    script.onerror = reject;
    script.charset = "utf-8";
    script.src = src;
    document.head.appendChild(script);
  });
};

const remoteLoader = async ({ entries, name }) => {
  return moduleNameMap.get(name) || await (async () => {
    for (let i = 0; i < entries.length; i++) {
      await loader(entries[i]);
    }
    return moduleNameMap.set(name, window[name]).get(name);
  })()
};

const loadable = ({ name, entries }) => {
  return {
    render (h,) {
      return h("div", [
        h("div", {
          ref: "root"
        })
      ]);
    },
    async mounted () {
      const unmount = (await (typeof entries === "function" ? entries() : remoteLoader({ name, entries }))).default({
        root: this.$refs.root,
        store: this.$store,
        Vue,
        VueRouter,
        name
      });
      this.$on("hook:beforeDestroy", () => {
        unmount();
      });
    },
  };
};

export default loadable;
