const connector = (options) => {
    const {createInstance, storeModule} = options

    let _instance
    let _store
    let _name
    const mount = ({root, store, Vue, VueRouter, name}) => {
        if (storeModule) {
            store.registerModule(name, {
                ...storeModule,
                namespaced: true
            })
        }
        _instance = createInstance({store, Vue, VueRouter}).$mount(root)
        _store = store
        _name = name
    }

    const unmount = () => {
        _instance.$destroy()
        _store.unregisterModule(_name)
    }

    return {mount, unmount}
}

export default connector