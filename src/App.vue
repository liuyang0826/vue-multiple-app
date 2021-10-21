<template>
  <div id="app">
    <router-link to="/">home</router-link> |
    <router-link to="/user">user</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
