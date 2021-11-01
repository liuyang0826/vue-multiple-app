<template>
  <div>
    <div>
      <el-form size="small" :model="query" inline>
        <el-form-item label="用户名">
          <el-input v-model="query.username" maxlength="100" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="query.password" maxlength="100" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="query.age" maxlength="2" />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="query.class" maxlength="100" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button size="small" @click="handleBatchDel">批量删除</el-button>
        <el-button size="small" icon="el-icon-plus" @click="handleAdd" type="primary">添加</el-button>
      </div>
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
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" @click="handleEdit(row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-form :visible.sync="addVisible" :data="addForm" :title="addTitle" />
    <edit-form :visible.sync="editVisible" :data="editForm" :title="editTitle" />
  </div>
</template>

<script>
import pipe from "../../utils/pipe";
import {
  useSearch,
  injectComponents,
  useModalFormCtrl
} from "../../utils"
import AddForm from "./components/AddForm"
import EditForm from "./components/EditForm"
import {
  getTableData
} from "./services/test"

export default pipe(
  useSearch({
    async getTableData() {
      const data = await getTableData()
      this.tableData = data
    },
    immediate: true
  }),
  useModalFormCtrl({ name: "add", title: "新增" }),
  useModalFormCtrl({ name: "edit", title: "编辑" }),
  injectComponents({ AddForm, EditForm })
)({
  name: "Test",
})
</script>

<style lang="scss" scoped></style>
