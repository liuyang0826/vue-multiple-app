<template>
  <el-dialog :visible.sync="visible" :title="title" @close="$emit('update:visible', false)" width="440px">
    <el-form :model="form" size="small" :rules="formRules" ref="form">
      <el-form-item label="用户名：" prop="username" label-width="80px">
        <el-input v-model="form.username" maxlength="100" />
      </el-form-item>
      <el-form-item label="密码：" prop="password" label-width="80px">
        <el-input v-model="form.password" maxlength="100" />
      </el-form-item>
      <el-form-item label="年龄：" prop="age" label-width="80px">
        <el-input v-model="form.age" maxlength="2" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select clearable v-model="form.sex">
          <el-option v-for="{ label, value } in sexOptions" :key="value" :label="label" :value="value"  />
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select clearable v-model="form.class" :disabled="!query.sex">
          <el-option v-for="{ label, value } in classOptions" :key="value" :label="label" :value="value"  />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
      <el-button size="small" type="primary" :loading="formLoading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import pipe from "@/utils/pipe";
import {
  useModalForm,
  useSelectOptions
} from "@/utils"
import {
  doSubmit,
  getClassOptions
} from "../services/update-form"

export default pipe(
  useModalForm({
    onShow() {},
    formRules: {},
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
  name: "UpdateForm",
})
</script>

<style lang="scss" scoped></style>
