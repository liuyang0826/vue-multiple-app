<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="462px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :model="form" size="small" inline :rules="rules" ref="formRef" style="margin-right: -10px">
      <el-form-item label="姓名：" prop="name" label-width="82px">
        <template #label>
          <div style="display: inline-flex; align-items: center">
            姓名
            <el-tooltip style="margin-left: 2px" content="姓名不可更改" placement="top">
              <el-icon size="mini">
                <Warning />
              </el-icon>
            </el-tooltip>
            ：
          </div>
        </template>
        <el-input v-model="form.name" placeholder="请输入姓名" :maxlength="2" style="width: 340px" />
      </el-form-item>
      <el-form-item label="性别：" prop="sex" label-width="82px">
        <el-radio-group v-model="form.sex">
          <el-radio v-for="{ label, value } in sexOptions" :key="value" :label="value">{{ label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄：" prop="age" label-width="82px">
        <el-input v-model="form.age" placeholder="请输入年龄" style="width: 340px">
          <template #append>岁</template>
        </el-input>
      </el-form-item>
      <el-form-item label="生日：" prop="birthday" label-width="82px">
        <el-date-picker type="datetimerange" v-model="form.birthday" placeholder="请选择生日" style="width: 340px" />
      </el-form-item>
      <el-form-item label="爱好：" prop="hobby" label-width="82px">
        <el-checkbox-group v-model="form.hobby">
          <el-checkbox v-for="{ label, value } in hobbyOptions" :key="value" :label="value">{{ label }}</el-checkbox>
        </el-checkbox-group>
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
import { submit } from '../services/userAddForm'
import { ElMessage } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
const props = defineProps({
  modelValue: Boolean,
  title: String,
  data: Object
})
const emit = defineEmits(['update:modelValue', 'success'])
let form = $ref({
  hobby: []
})
let loading = $ref(false)
let formRef = $ref()
let rules = {
  name: { required: true, message: '请输入姓名', trigger: ['change', 'blur'] },
  sex: { required: true, message: '请选择性别', trigger: ['change', 'blur'] },
  age: { required: true, message: '请输入年龄', trigger: ['change', 'blur'] },
  birthday: { required: true, message: '请选择生日', trigger: ['change', 'blur'] },
  hobby: { required: true, message: '请选择爱好', trigger: ['change', 'blur'] }
}
const sexOptions = [
  { label: '男', value: '1' },
  { label: '女', value: '2' }
]
const hobbyOptions = [
  { label: '篮球', value: '1' },
  { label: '唱歌', value: '2' },
  { label: '游泳', value: '3' }
]
watch(
  () => props.modelValue,
  visible => {
    if (visible) {
      return
    }
    loading = false
    form = JSON.parse(JSON.stringify(props.data))
    nextTick(() => {
      formRef.clearValidate()
    })
  }
)
// 转换表单数据
function formTransform(form) {
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
        const { status, message } = await submit(formTransform(form))
        if (status) {
          ElMessage.success('操作成功')
          emit('update:modelValue', false)
          emit('success')
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
