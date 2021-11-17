<template>
  <div id="app">
    <button type="button" v-for="(item, index) in routes" :key="index" @click="handleClick(item)">
      {{item.text}}
    </button>
    <div>{{$store.state.count}}</div>
    <div>----{{ ($store.state["app_device"] || []).deviceList }}----</div>
    <router-view />
  </div>
</template>

<script>
import loadable from "@cisdiliuyang/vue-multiple-app/loadable";

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
          to: "/user/home",
        },
        {
          text: "device",
          to: "/device/home",
        }
      ],
      routeKey: 1
    }
  },
  created() {
    fetch("/multiple.config")
    .then(res => res.json())
    .then((apps) => {
      this.$router.addRoutes(apps.map((app) => {
        const { name, path, entry } = app
        return {
          path,
          component: loadable({
            name,
            entry
          })
        }
      }))
    })
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

<style>
html, body, div, p, ol, ul, li {
  margin: 0;
  padding: 0;
}
body {
  padding: 20px;
  background: #f0f0f0;
}
</style>
