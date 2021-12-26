<template>
  <div v-for="item in formItems" :key="[...paths, item.prop].join('.')">
    <form-item
        v-if="item.type !== 'list'"
        :type="item.type"
        :label="item.label"
        :prop="item.prop"
        :paths="[...paths, ...(item.subPaths || []), item.prop]"
        v-model="getPropByPath(model, item.subPaths)[item.prop]"
        :options="item.options"
        :placeholder="item.placeholder"
        :prepend="item.prepend"
        :tips="item.tips"
        :dialog-width="item.dialogWidth"
    />
    <div v-else style="margin-bottom: 18px;">
      <div class="table-title">
        <span>{{item.label}}：</span>
        <el-icon @click="getPropByPath(model, item.subPaths)[item.prop].push({})" style="cursor:pointer;">
          <circle-plus-filled />
        </el-icon>
      </div>
      <el-table :data="getPropByPath(model, item.subPaths)[item.prop]" border size="mini" stripe>
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
              :prop="subItem.prop"
              :paths="[...paths, ...(item.subPaths || []), item.prop, $index]"
              v-model="row[subItem.prop]"
              :options="subItem.options"
              :placeholder="subItem.placeholder"
              :prepend="subItem.prepend"
              :tips="subItem.tips"
              :dialog-width="subItem.dialogWidth"
              is-inner-table
            >
              <FormPane
                :schemas="subItem.schemas"
                :paths="[...paths, ...(item.subPaths || []), item.prop, $index]"
                :model="row"
              />
            </form-item>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="40" align="center">
          <template v-slot:default="{ $index }">
            <el-icon size="mini" @click="getPropByPath(model, item.subPaths)[item.prop].splice($index, 1)" style="cursor:pointer;">
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
import {getPropByPath, resolveSchemas} from "../../utils"
import {reactive, watch, watchSyncEffect} from "vue";

const props = defineProps<{
  schemas: any[]
  model: any,
  paths: any[]
}>()

let formItems = $ref([])

watch(() => [props.model, props.schemas], async () => {
  const newFormItems = []
  async function process(schemas, model) {
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i]
      newFormItems.push(schema)
      if (!(schema.prop in model)) {
        model[schema.prop] = schema.default
        if (["checkboxGroup", "list"].includes(schema.type) && !model[schema.prop]) {
          model[schema.prop] = reactive([])
        }
      }
      const effect = await schema.effect?.({ model, schemas, resolveSchemas })
      if (!effect) {
        continue
      }
      if (Array.isArray(effect)) {
        await process(effect, model)
      } else {
        if (!model[effect.prop]) {
          model[effect.prop] = reactive({})
        }
        await process(effect.schemas.map(d => ({...d, subPaths: [...(schema.subPaths || []), effect.prop]})), model[effect.prop])
      }
    }
  }
  await process(props.schemas, props.model)
  formItems = newFormItems
}, {
  immediate: true,
  deep: true
})
</script>