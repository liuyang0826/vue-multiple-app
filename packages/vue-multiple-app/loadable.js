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

const remoteLoader = async ({ entry, name }) => {
  return moduleNameMap.get(name) || await (async () => {
    const realEntry = entry.endsWith("/") ? entry.slice(0, -1) : entry

    await scriptLoader(["assets.js"], realEntry)
    const { css, js } = window[name]
    delete window[name]

    await Promise.all([styleLoader(css, realEntry), scriptLoader(js, realEntry)])

    const result = window[name]
    delete window[name]
    return moduleNameMap.set(name, result).get(name);
  })()
};

const loadable = ({ name, entry }) => {
  return {
    render(h) {
      return h("div")
    },
    async mounted () {
      console.log(1111, this.$router);
      const unmount = (await (typeof entry === "function" ? entry() : remoteLoader({ name, entry }))).default({
        root: this.$el,
        store: this.$store,
        Vue: this.$root.constructor,
        VueRouter: this.$router.constructor,
        name
      });
      this.$on("hook:beforeDestroy", () => {
        unmount();
      });
    },
  };
};

export default loadable;
