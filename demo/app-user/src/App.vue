<template>
  <div class="contanier">
    <div id="nav">
      <router-link to="/user/home">Home</router-link> |
      <router-link to="/user/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
.contanier {
  padding: 12px;
  border-radius: 4px;
}
#nav {
  margin-bottom: 20px;
}
.table-tool {
  margin-bottom: 20px;
}
.tree-content {
  width: 320px;
}
.tree-wrap {
  padding-top: 16px;
}
</style>
