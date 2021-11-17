<template>
  <div>
    <div id="nav">
      <router-link to="/device/home">Home</router-link> |
      <router-link to="/device/about">About</router-link>
    </div>
    <div>{{ $store.state.count }}</div>
    <div>----{{ $store.state["app_device"].deviceList }}----</div>
    <router-view/>
  </div>
</template>


