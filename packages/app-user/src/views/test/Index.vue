<template>
  <div>
    <div>
      <el-form size="small" :model="query" inline>
        <el-form-item label="用户名">
          <el-input clearable v-model="query.username" maxlength="" @change="handleSearch" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input clearable v-model="query.age" maxlength="" @change="handleSearch" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select clearable v-model="query.sex"  @change="handleSearch">
            <el-option v-for="{ label, value } in sexOptions" :key="value" :label="label" :value="value"  />
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸">
          <el-select clearable v-model="query.size"  @change="handleSearch">
            <el-option v-for="{ label, value } in sizeOptions" :key="value" :label="label" :value="value"  />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button size="small" icon="el-icon-plus" @click="handleAdd" type="primary">添加</el-button>
      </div>
    </div>
    <el-table size="small" :data="tableData" v-loading="searchLoading">
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="年龄" prop="age" />
      <el-table-column label="性别" prop="sex" />
      <el-table-column label="尺寸" prop="size" />
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
    <add-form :visible.sync="addVisible" :data="addData" :title="addTitle" />
    <update-form :visible.sync="updateVisible" :data="updateData" :title="updateTitle" />
  </div>
</template>

<script>
import pipe from "@/utils/pipe";
import {
  injectComponents,
  useSearch,
  usePager,
  useSelectOptions,
  useModalFormCtrl
} from "@/utils"
import AddForm from "./components/AddForm"
import UpdateForm from "./components/UpdateForm"
import {
  getTableData,
  getSizeOptions
} from "./services"

export default pipe(
  injectComponents({
    AddForm,
    UpdateForm
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
    namespace: "size",
    options: [],
    async getOptions() {
      const { status, data, message } = await getSizeOptions()
      if (status) {
        this.sizeOptions = data
      } else {
        this.$message.error(message)
      }
    }
  }),
  useModalFormCtrl({ name: "add", title: "添加用户" }),
  useModalFormCtrl({ name: "update", title: "修改用户" })
)({
  name: "Test",
})
</script>

<style lang="scss" scoped></style>
