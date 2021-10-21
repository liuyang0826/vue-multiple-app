<template>
<div>
  <div>home-B</div>
  <button @click="$store.commit('increment')">增加</button>
</div>
</template>

<script>
export default {
  name: "A"
}
</script>

<style scoped>

</style>