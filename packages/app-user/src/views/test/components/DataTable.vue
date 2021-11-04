<template>
  <div>
    <div>
      <el-form size="small" :model="query" inline>
        <el-form-item label="用户名">
          <el-input clearable v-model="query.username" maxlength="100" @change="handleSearch" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input clearable v-model="query.password" maxlength="100" @change="handleSearch" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input clearable v-model="query.age" maxlength="2" @change="handleSearch" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select clearable v-model="query.sex"  @change="handleSearch">
            <el-option v-for="{ label, value } in sexOptions" :key="value" :label="label" :value="value"  />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select clearable v-model="query.class"  @change="handleSearch" :disabled="!query.sex">
            <el-option v-for="{ label, value } in classOptions" :key="value" :label="label" :value="value"  />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table size="small" :data="tableData" v-loading="searchLoading">
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="密码" prop="password" />
      <el-table-column label="年龄" prop="age" />
      <el-table-column label="班级" prop="class" />
      <el-table-column label="备注" prop="remarks" />
      <el-table-column label="备注" prop="remarks" />
      <el-table-column label="备注" prop="remarks" />
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
  injectProps,
  useSearch,
  usePager,
  useSelectOptions
} from "@/utils"
import {
  getTableData,
  getClassOptions
} from "../services/data-table"

export default pipe(
  injectProps({
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
  usePager({ onChange: "handleSearch" }),
  useSelectOptions({
    namespace: "sex",
    options: [
      { value: "1", label: "男" },
      { value: "2", label: "女" }
    ]
  }),
  useSelectOptions({
    namespace: "class",
    options: [],
    async getOptions() {
      const { status, data, message } = await getClassOptions()
      if (status) {
        this.classOptions = data
      } else {
        this.$message.error(message)
      }
    },
    dep: "query.sex"
  })
)({
  name: "DataTable",
})
</script>

<style lang="scss" scoped></style>
