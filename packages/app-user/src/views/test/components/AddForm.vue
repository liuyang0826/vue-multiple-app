<template>
  <el-dialog :visible.sync="visible" :title="title" @close="$emit('update:visible', false)" width="440px">
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
    </el-form>
    <template #footer>
      <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
      <el-button size="small" type="primary" :loading="formLoading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import pipe from "../../utils/pipe";
import {
  useModalForm
} from "../../utils"
import {
  add
} from "../services"

export default pipe(
  useModalForm({
    onShow() {},
    formRules: {
      username: { required: true, message: "请输入用户名" },
      password: { required: true, message: "请输入密码" }
    },
    async onSubmit() {
      await add(this.form)
    }
  })
)({
  name: "AddForm",
})
</script>

<style lang="scss" scoped></style>
