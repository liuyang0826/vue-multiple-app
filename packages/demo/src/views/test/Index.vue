<template>
  <el-tabs type="card" v-model="activeTabName">
    <el-tab-pane label="用户管理" name="user">
      <user />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import user from './components/User.vue'
const activeTabName = $ref('user')
</script>
