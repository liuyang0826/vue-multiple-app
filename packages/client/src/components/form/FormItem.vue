<template>
  <el-form-item :key="prop" :prop="prop">
    <template v-if="!isInnerTable" #label>
      <div style="display: flex;align-items: center;">
        {{label}}
        <el-tooltip v-if="tips" style="margin-left: 2px;" effect="light" placement="bottom">
          <el-icon size="mini">
            <Warning />
          </el-icon>
          <template #content>
            <div v-html="tips"></div>
          </template>
        </el-tooltip>
        ：
      </div>
    </template>
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
        :placeholder="placeholder"
    >
      <el-option v-for="{label, value} in options" :key="value" :label="label" :value="value"/>
    </el-select>
    <el-checkbox-group
        v-else-if="type === 'checkboxGroup'"
        :model-value="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        @change="$emit('change', $event)"
        style="width: 100%;"
    >
      <el-checkbox v-for="{label, value} in options" :key="value" :label="value">{{label}}</el-checkbox>
    </el-checkbox-group>
    <el-radio-group
        v-else-if="type === 'radio'"
        :model-value="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
      <el-radio v-for="{label, value} in options" :key="value" :label="value">{{label}}</el-radio>
    </el-radio-group>
    <div
        v-else-if="hasDialog"
        :style="`height: 28px;display: flex;align-items: center;${isInnerTable ? 'justify-content: center;' : ''}`"
    >
      <el-icon size="mini" style="cursor:pointer;" @click="visible = true">
        <edit/>
      </el-icon>
    </div>
    <el-input v-else :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :placeholder="placeholder">
      <template v-if="prepend" #prepend>{{ prepend }}</template>
    </el-input>
    <el-dialog v-if="hasDialog" v-model="visible" append-to-body width="480px">
      <template #title>
        <div style="display: flex;align-items: center;">
          {{label}}
          <el-tooltip v-if="tips" style="margin-left: 2px;" effect="light" placement="bottom">
            <el-icon size="mini">
              <Warning />
            </el-icon>
            <template #content>
              <div v-html="tips"></div>
            </template>
          </el-tooltip>
        </div>
      </template>
      <Codemirror v-if="type === 'code'" :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" />
      <FormPane v-else :context="context" />
    </el-dialog>
  </el-form-item>
</template>

<script setup lang="ts">
import { Edit, Warning } from "@element-plus/icons-vue"
import FormPane from "./FormPane.vue"
import Codemirror from "../Codemirror.vue";

const props = defineProps<{
  type: "text" | "number" | 'switch' | 'select' | 'radio'
  label?: string
  placeholder?: string
  prop: string
  prepend?: string
  tips?: string
  modelValue?: string | boolean | number | any[]
  options?: {
    label: string
    value: string
  }[]
  context?: any
  isInnerTable?: boolean
}>()

const visible = $ref(false)

const hasDialog = $computed(() => ['list', 'code', 'more'].includes(props.type))
</script>