<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="732px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :model="form" size="small" inline :rules="rules" ref="formRef"> </el-form>
    <template #footer>
      <el-button size="small" @click="$emit('update:modelValue', false)">取消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { watch } from 'vue'
import { add } from '../services'
import { ElMessage } from 'element-plus'
const props = defineProps({
  modelValue: Boolean,
  title: String,
  data: Object
})
let form = $ref({})
let loading = $ref(false)
let formRef = $ref()
let rules = {}
watch(
  props.modelValue,
  visible => {
    if (visible) {
      loading = false
      form = JSON.parse(JSON.stringify(data))
      formRef.clearValidate()
    }
  },
  {
    immediate: true
  }
)
// 转换表单数据
function paramsTransform(form) {
  return {
    realName: form.name,
    price: form.price * 100
  }
}
function handleSubmit() {
  formRef.validate(async flag => {
    if (flag) {
      loading = true
      try {
        const { status, message } = await add(paramsTransform(form))
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
