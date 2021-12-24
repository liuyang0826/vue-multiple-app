<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="380px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :model="form" size="small" inline :rules="rules" ref="formRef" style="margin-right: -10px">
      <el-form-item label="用户名：" prop="name" label-width="80px">
        <el-input clearable v-model="form.name" placeholder="请输入用户名" style="width: 260px" />
      </el-form-item>
      <el-form-item label="性别：" prop="sex" label-width="80px">
        <el-input clearable v-model="form.sex" placeholder="请输入性别" style="width: 260px" />
      </el-form-item>
      <el-form-item label="尺寸：" prop="size" label-width="80px">
        <el-input clearable v-model="form.size" placeholder="请输入尺寸" style="width: 260px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="$emit('update:modelValue', false)">取消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { watch, nextTick } from 'vue'
import { update } from '../services'
import { ElMessage } from 'element-plus'
const props = defineProps({
  modelValue: Boolean,
  title: String,
  data: Object
})
let form = $ref({})
let loading = $ref(false)
let formRef = $ref()
let rules = {
  name: { required: true, message: '请输入用户名', trigger: ['change', 'blur'] },
  sex: { required: true, message: '请输入性别', trigger: ['change', 'blur'] },
  size: { required: true, message: '请输入尺寸', trigger: ['change', 'blur'] }
}
watch(
  () => props.modelValue,
  visible => {
    if (visible) {
      return
    }
    nextTick(() => {
      loading = false
      form = JSON.parse(JSON.stringify(props.data))
      formRef.clearValidate()
    })
  }
)
function handleSubmit() {
  formRef.validate(async flag => {
    if (flag) {
      loading = true
      try {
        const { status, message } = await update(form)
        if (status) {
          ElMessage.success('操作成功')
        } else {
          ElMessage.error(message)
        }
      } finally {
        loading = false
      }
    }
  })
}
</script>
