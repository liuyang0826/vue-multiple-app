<template>
  <div id="app">
    <header class="header">
    </header>
    <aside class="aside">
      <div class="logo">FAST - CURD</div>
      <ul>
        <li v-for="(item, index) in routes" :key="index" @click="handleClick(item)">
          {{item.text}}
        </li>
      </ul>
    </aside>
    <main class="main">
      <router-view />
    </main>
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
          text: "测试页面",
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
*, *:before, *:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: #f7f8fc;
  padding: 66px 12px 12px 252px;
}
</style>

<style scoped>
.header {
  position: fixed;
  left: 240px;
  top: 0;
  right: 0;
  height: 66px;
  background: #fff;
  z-index: 999;
}

.logo {
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
}

.aside {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  z-index: 999;
  background: #fff;
}
.main {
  background: #fff;
  margin-top: 12px;
  min-height: calc(100vh - 90px);
  border-radius: 4px;
}
</style>
