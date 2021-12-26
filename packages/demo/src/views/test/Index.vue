<template>
  <el-tabs type="card" v-model="activeTabName">
    <el-tab-pane label="用户管理" name="user">
      <user />
    </el-tab-pane>
    <el-tab-pane label="项目管理" name="project">
      <project />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import user from './components/User.vue'
import project from './components/Project.vue'
const activeTabName = $ref('user')
</script>
