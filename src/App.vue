<template>
  <div id="app">
    <button type="button" v-for="(item, index) in routes" :key="index" @click="handleClick(item)">
      {{item.text}}
    </button>
    <div>{{$store.state.count}}</div>
    <div>----{{ ($store.state["appDevice"] || []).deviceList }}----</div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      routes: [
        {
          text: "home",
          to: "/",
        },
        {
          text: "user",
          to: "/user/a",
        },
        {
          text: "device",
          to: "/device/home",
        }
      ],
      routeKey: 1
    }
  },
  methods: {
    handleClick(item) {
      if (item.to === this.$route.path) {
        return
      }
      this.$router.replace(item.to)
    }
  }
}
</script>
