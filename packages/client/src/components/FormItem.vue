<template>
  <el-form-item :prop="paths.join('.')" :rules="rules" :show-message="!isInnerTable">
    <template v-if="!isInnerTable" #label>
      <div style="display: inline-flex;align-items: center;">
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
    />
    <el-select
        v-else-if="type === 'select'"
        :model-value="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        style="width: 100%;"
        :placeholder="placeholder"
    >
      <el-option v-for="{label, value} in options" :key="value" :label="label" :value="value"/>
    </el-select>
    <el-checkbox-group
        v-else-if="type === 'checkboxGroup'"
        :model-value="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
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
    <div v-else-if="type === 'more' && !isInnerTable" class="more-line" @click="$emit('update:modelValue', !modelValue)">
      {{ modelValue ? "收起" : "展开" }}<el-icon :class="{ 'active': modelValue }"><arrow-right /></el-icon>
    </div>
    <el-input v-else :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :placeholder="placeholder">
      <template v-if="prepend" #prepend>{{ prepend }}</template>
    </el-input>
    <el-drawer v-if="hasDialog" v-model="visible" append-to-body :show-close="false" :size="`${dialogWidth || 480}px`">
      <template #title>
        <div style="display: flex;align-items: center;">
          <div style="display: flex;align-items: center;flex: 1;">
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
          <el-button size="mini" type="primary" @click="visible = false">确定</el-button>
        </div>
      </template>
      <Codemirror v-if="type === 'code' && visible" :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" />
      <slot v-else />
    </el-drawer>
  </el-form-item>
</template>

<script setup lang="ts">
import { Edit, Warning, ArrowRight } from "@element-plus/icons-vue"
import Codemirror from "./Codemirror.vue";

const props = defineProps<{
  type: "text" | "number" | 'switch' | 'select' | 'radio'
  label?: string
  prop?: string
  placeholder?: string
  prepend?: string
  tips?: string
  modelValue?: any
  dialogWidth?: any
  options?: {
    label: string
    value: string
  }[]
  isInnerTable?: boolean
  paths: string[]
  rules?: any
}>()

const visible = $ref(false)

const hasDialog = $computed(() => (props.type === 'more' && props.isInnerTable) || ['list', 'code', 'table'].includes(props.type))
</script>

<style>
.more-line {
  height: 28px;
  display: flex;
  align-items: center;
  color: var(--el-text-color-regular);
  cursor: pointer;
}
.more-line .el-icon {
  transition: transform .3s ease;
  margin-left: 4px;
}
.more-line .active {
  transform: rotate(90deg);
}
</style>