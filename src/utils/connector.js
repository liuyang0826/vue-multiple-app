const connector = (createInstance) => {
    const mount = ({root, store}) => {
        root.$instance = createInstance({root, store})
    }

    const unmount = ({root}) => {
        root.$instance.$destroy()
        root.innerHTML = ""
    }

    return {mount, unmount}
}

export default connector