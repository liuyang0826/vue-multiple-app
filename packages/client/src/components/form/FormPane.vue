<template>
  <div v-for="item in context.formItems" :key="item.prop">
    <form-item
        v-if="item.type !== 'list'"
        :type="item.type"
        :label="item.label"
        :prop="`${[...item.context.path, item.prop].join('.')}`"
        v-model="item.context.model[item.prop]"
        :options="item.options"
        :placeholder="item.placeholder"
        :prepend="item.prepend"
        :tips="item.tips"
        :dialog-width="item.dialogWidth"
        @change="mapFormItems(item.context)"
    />
    <div v-else style="margin-bottom: 18px;">
      <div class="table-title">
        <span>{{item.label}}：</span>
        <el-icon @click="add(item)" style="cursor:pointer;">
          <circle-plus-filled />
        </el-icon>
      </div>
      <el-table :data="item.context.model[item.prop]" border size="mini" stripe>
        <el-table-column
            v-for="subItem in item.schemas"
            :label="subItem.label"
            :width="subItem.width"
            :min-width="subItem.width || 160"
            :align="['list', 'code', 'more'].includes(subItem.type) ? 'center' : 'left'"
        >
          <template v-slot:default="{ row, $index }">
            <form-item
                style="margin-bottom: 0;"
                :type="subItem.type"
                :label="subItem.label"
                :key="`${[...item.context.path, item.prop].join('.')}.${$index}.${subItem.prop}`"
                :prop="`${[...item.context.path, item.prop].join('.')}.${$index}.${subItem.prop}`"
                v-model="row[subItem.prop]"
                :options="subItem.options"
                :placeholder="subItem.placeholder"
                :prepend="subItem.prepend"
                :tips="subItem.tips"
                :dialog-width="subItem.dialogWidth"
                @change="mapFormItems(item.context)"
                :context="subItem.context"
                is-inner-table
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="40" align="center">
          <template v-slot:default="{ $index }">
            <el-icon size="mini" @click="item.context.model[item.prop].splice($index, 1)" style="cursor:pointer;">
              <delete />
            </el-icon>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormItem from "./FormItem.vue"
import { Delete, CirclePlusFilled } from "@element-plus/icons-vue"
import { add, mapFormItems } from "../../utils"

defineProps<{
  context: any
}>()

const tableColWithMap = {
  text: 168,
  code: 60,
  list: 60,
  switch: 60
}

</script>

<style scoped>

</style>