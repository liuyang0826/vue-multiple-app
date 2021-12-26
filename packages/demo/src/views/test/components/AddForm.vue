<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="382px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :model="form" size="small" inline :rules="rules" ref="formRef" style="margin-right: -10px">
      <el-form-item label="姓名：" prop="name" label-width="82px">
        <template #label>
          <div style="display: inline-flex; align-items: center">
            姓名
            <el-tooltip style="margin-left: 2px" content="姓名" placement="top">
              <el-icon size="mini">
                <Warning />
              </el-icon>
            </el-tooltip>
            ：
          </div>
        </template>
        <el-input clearable v-model="form.name" placeholder="请输入姓名" style="width: 260px" />
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
import { submit } from '../services/add-form'
import { ElMessage } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
const props = defineProps({
  modelValue: Boolean,
  title: String,
  data: Object
})
let form = $ref({})
let loading = $ref(false)
let formRef = $ref()
let rules = {
  name: { required: true, message: '请输入姓名', trigger: ['change', 'blur'] }
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
        const { status, message } = await submit(form)
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
