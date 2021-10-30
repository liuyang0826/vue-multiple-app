<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    --{{age}}--
    <button @click="handleClick">点击</button>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

const injectData = (options, injectData) => {
  const data = options.data
  options.data = () => {
    return {
      ...data?.(),
      ...injectData
    }
  }
}

const injectMethods = (options, injectMethods) => {
  const methods = options.methods
  const newOptions = Object.keys(injectMethods).reduce((options, key) => {
    const injectFn = injectMethods[key]
    options[key] = methods[key] ? function () {
      injectFn.call(this)
      methods[key].call(this)
    } : injectFn
    return options
  }, {})

  options.methods = {
    ...methods,
    ...newOptions,
  }
}

const withAge = (options) => {
  injectData(options, {
    age: 0
  })

  injectMethods(options, {
    handleClick() {
      this.age++
    }
  })
  return options
}

export default withAge({
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    handleClick() {
      console.log(1);
    }
  }
})
</script>

<style scoped>
.home ::v-deep a {
  color: red;
}
</style>
