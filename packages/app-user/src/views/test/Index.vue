<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户信息" name="user">
      <user-table :data="userTableData" />
    </el-tab-pane>
    <el-tab-pane label="车辆信息" name="car">
      <car-table :data="carTableData" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import pipe from "@/utils/pipe";
import {
  useComponents,
  useData,
  useMethods
} from "@/utils"
import UserTable from "./components/UserTable"
import CarTable from "./components/CarTable"
export default pipe(
  useComponents({
    UserTable,
    CarTable
  }),
  useData({
    activeName: "user"
  }),
  useMethods({
    handleClick() {
    }
  }),
  useData({
    userTableData: {}
  }),
  useData({
    carTableData: {}
  })
)({
  name: "Test",
})
</script>

<style lang="scss" scoped></style>
