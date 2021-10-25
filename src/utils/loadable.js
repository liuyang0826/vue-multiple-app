import Vue from "vue";
import VueRouter from "vue-router";

const moduleNameMap = new Map();

const scriptLoader = async (js, entry) => {
  const loader = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.onload = () => {
        resolve();
      };
      script.onerror = reject;
      script.charset = "utf-8";
      script.src = `${entry}/${src}`;
      document.head.appendChild(script);
    });
  }
  for (let i = 0; i < js.length; i++) {
    await loader(js[i]);
  }
};

const styleLoader = async (css, entry) => {
  const loader = (src) => {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.onload = () => {
        resolve();
      };
      link.onerror = reject;
      link.href = `${entry}/${src}`;
      document.head.appendChild(link);
    });
  }

  await Promise.all(css.map(d => loader(d)))
}

const entryLoader = (entry) => {
  return fetch(`${entry}/assets.json`)
      .then((res) => res.json())
}

const remoteLoader = async ({ entry, name }) => {
  return moduleNameMap.get(name) || await (async () => {
    const realEntry = entry.endsWith("/") ? entry.slice(0, -1) : entry

    const { css, js } = await entryLoader(realEntry)
    await Promise.all([styleLoader(css, realEntry), scriptLoader(js, realEntry)])
    return moduleNameMap.set(name, window[name]).get(name);
  })()
};

const loadable = ({ name, entry }) => {
  return {
    render() {},
    async mounted () {
      const unmount = (await (typeof entry === "function" ? entry() : remoteLoader({ name, entry }))).default({
        root: this.$root.$el,
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
