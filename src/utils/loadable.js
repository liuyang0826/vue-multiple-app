import Vue from "vue"
import VueRouter from "vue-router"

const moduleNameMap = new Map()

const remoteLoader = async ({entries, name}) => {
    let result = moduleNameMap.get(name)
    if (result) {
        return result
    }

    const loader = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.onload = () => {
                resolve()
            }
            script.onerror = reject
            script.charset = "utf-8"
            script.src = src
            document.head.appendChild(script)
        })
    }

    for (let i = 0; i < entries.length; i++){
        await loader(entries[i])
    }

    result = window[name]

    moduleNameMap.set(name, result)

    return result
}

const loadable = ({name, entries}) => {
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
          const {mount, unmount} = (await (typeof entries === "function" ? entries() : remoteLoader({name, entries}))).default
          _unmount = unmount
          mount({
              root: this.$refs.root,
              store: this.$store,
              Vue,
              VueRouter,
              name
          })
      },
      beforeDestroy() {
          _unmount()
      }
  }
}

export default loadable