<template>
  <div>
    <router-link to="/user/a">a</router-link>
    |
    <router-link to="/user/b">b</router-link>
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