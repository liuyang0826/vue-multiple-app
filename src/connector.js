const connector = (options) => {
  const { App, routerOption, beforeEach, afterEach, storeModule } = options;

  return ({ root, store, Vue, VueRouter, name }) => {
    if (store && storeModule) {
      store.registerModule(name, {
        ...storeModule,
        namespaced: true
      });
    }
    const router = new VueRouter(routerOption)

    if (beforeEach) {
      router.beforeEach(beforeEach)
    }

    if (afterEach) {
      router.afterEach(afterEach)
    }

    const instance = new Vue({
      render: h => h(App),
      router,
      store,
    }).$mount();

    root.appendChild(instance.$el)
    const htmlNode = document.getElementsByTagName("html")[0]
    htmlNode.classList.add(name)

    return () => {
      instance.$destroy();
      root.removeChild(instance.$el)
      htmlNode.classList.remove(name)
      if (store && storeModule) {
        store.unregisterModule(name);
      }
    };
  };
};

export default connector;


function sortNodeClass(attr, length) {
  const nodes = [...document.body.querySelectorAll("*")]

  return nodes.filter(d => d[attr].length > length).sort((a, b) => a[attr].length - b[attr].length)
}