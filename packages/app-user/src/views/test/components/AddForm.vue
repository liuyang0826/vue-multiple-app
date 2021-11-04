<template>
  <el-dialog :visible.sync="visible" :title="title" @close="$emit('update:visible', false)" width="1000px">
    <el-form :model="form" size="small" :rules="formRules" ref="form">
      <el-form-item label="用户名：" prop="username" label-width="80px">
        <el-input v-model="form.username" maxlength="100" />
      </el-form-item>
      <el-form-item label="密码：" prop="password" label-width="80px">
        <el-input v-model="form.password" maxlength="100" />
      </el-form-item>
      <el-form-item label="班级：" prop="class" label-width="80px">
        <el-input v-model="form.class" maxlength="100" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select clearable v-model="form.sex">
          <el-option v-for="{ label, value } in sexOptions" :key="value" :label="label" :value="value"  />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
      <el-button size="small" type="primary" :loading="formLoading" @click="handleSubmit">确定</el-button>
    </template>
    <data-table :data="subTableData" />
  </el-dialog>
</template>

<script>
import pipe from "@/utils/pipe";
import {
  injectComponents,
  useModalForm,
  useSelectOptions,
  injectData
} from "@/utils"
import DataTable from "./DataTable"
import {
  doSubmit
} from "../services/add-form"

export default pipe(
  injectComponents({
    DataTable
  }),
  useModalForm({
    onShow() {},
    formRules: {
      username: { required: true, message: "请输入用户名", trigger: ["change", "blur"] },
      password: { required: true, message: "请输入密码", trigger: ["change", "blur"] }
    },
    async onSubmit() {
      const { status, message } = await doSubmit(this.form)
      if (status) {
        this.$message.error("操作成功")
        this.$emit("update:visible", false)
      } else {
        this.$message.error(message)
      }
    }
  }),
  useSelectOptions({
    namespace: "sex",
    options: [
      { value: "1", label: "男" },
      { value: "2", label: "女" }
    ]
  }),
  injectData({
    undefinedTableData: {}
  })
)({
  name: "AddForm",
})
</script>

<style lang="scss" scoped></style>
