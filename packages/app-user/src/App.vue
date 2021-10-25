<template>
  <div>
    <div id="nav">
      <router-link to="/user/home">Home</router-link> |
      <router-link to="/user/about">About</router-link>
    </div>
    <div>{{ $store.state.count }}</div>
    <div>----{{ $store.state["app_user"].deviceList }}----</div>
    <router-view/>
  </div>
</template>


