<template>
  <div>
    <router-link to="/">a</router-link>
    |
    <router-link to="/b">b</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
}
</script>

<style scoped>

</style>