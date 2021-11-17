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
  width: 100%;
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 120px);
  box-sizing: border-box;
  border-radius: 4px;
}
#nav {
  margin-bottom: 20px;
}
.table-tool {
  margin-bottom: 20px;
}
</style>
