<template>
  <el-dialog :visible.sync="visible" :title="title" @close="$emit('update:visible', false)" width="500px">
    <detail-table :data="detailTableData" />
  </el-dialog>
</template>

<script>
import pipe from "@/utils/pipe";
import {
  injectComponents,
  useModal,
  injectData
} from "@/utils"
import DetailTable from "./DetailTable"
export default pipe(
  injectComponents({
    DetailTable
  }),
  useModal({}),
  injectData({
    detailTableData: {}
  })
)({
  name: "DetailDialog",
})
</script>

<style lang="scss" scoped></style>
