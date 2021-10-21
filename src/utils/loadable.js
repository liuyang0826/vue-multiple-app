const remoteLoader = ({src, moduleName}) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.onload = () => {
            resolve(window[moduleName])
        }
        script.onerror = reject
        script.src = src
        document.head.appendChild(script)
    })
}

const loadable = (options) => {
    let _unmount
    return {
      render(h, ) {
          return h("div", [
              h("div", {
                  ref: "root"
              })
          ])
      },
      async mounted() {
          const {mount, unmount} = await (typeof options === "function" ? options() : remoteLoader(options))
          _unmount = unmount
          mount({root: this.$refs.root, store: this.$store})
      },
      beforeDestroy() {
          _unmount({root: this.$refs.root})
      }
  }
}

export default loadable