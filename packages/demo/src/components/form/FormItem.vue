<template>
  <el-form-item :key="prop" :label="label" :prop="prop">
    <el-switch
        v-if="type === 'switch'"
        :model-value="modelValue"
        @input="$emit('update:modelValue', $event)"
        @change="$nextTick(() => $emit('change', $event))"
    />
    <el-select
        v-else-if="type === 'select'"
        :model-value="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        @change="$emit('change', $event)"
        style="width: 100%;"
    >
      <el-option v-for="{label, value} in options" :key="value" :label="label" :value="value"/>
    </el-select>
    <el-radio-group
        v-else-if="type === 'radio'"
        :model-value="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
      <el-radio v-for="{label, value} in options" :key="value" :label="value">{{label}}</el-radio>
    </el-radio-group>
    <div
        v-else-if="type === 'code'"
        style="text-align:center;"
    >
      <el-icon size="mini" style="cursor:pointer;" @click="visible = true">
        <edit/>
      </el-icon>
    </div>
    <el-input type="text" v-else :model-value="modelValue" @input="$emit('update:modelValue', $event)">
      <template #prepend>Http://</template>
    </el-input>
<!--    <el-dialog v-model="visible" destroy-on-close title="格式化代码" append-to-body>
      <Codemirror />
    </el-dialog>-->
  </el-form-item>
</template>

<script setup lang="ts">
import { Edit } from "@element-plus/icons-vue"
import Codemirror from "../Codemirror.vue";

defineProps<{
  type: "text" | "number" | 'switch' | 'select' | 'radio'
  label?: string
  prop: string
  modelValue?: string | boolean | number
  options?: {
    label: string
    value: string
  }[]
}>()

const visible = $ref(false)
</script>