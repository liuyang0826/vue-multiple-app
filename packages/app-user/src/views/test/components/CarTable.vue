<template>
  <div>
    <div>
      <el-form size="small" :model="query" inline>
        <el-form-item>
          <el-button @click="handleSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table size="small" :data="tableData" v-loading="searchLoading">
      <el-table-column label="名称" prop="name" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button size="small" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="small" @click="handleDelete(row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 16px;"
      small
      background
      :total="total"
      :page-size="pageSize"
      :current-page="pageNum"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script>
import pipe from "@/utils/pipe";
import {
  useProps,
  useSearch,
  usePager
} from "@/utils"
import {
  getTableData
} from "../services/car-table"

export default pipe(
  useProps({
    data: Object
  }),
  useSearch({
    async getTableData() {
      const { status, data, message } = await getTableData()
      if (status) {
        this.tableData = data
      } else {
        this.$message.error(message)
      }
    },
    immediate: true
  }),
  usePager({ onChange: "handleSearch" })
)({
  name: "CarTable",
})
</script>

<style lang="scss" scoped></style>
