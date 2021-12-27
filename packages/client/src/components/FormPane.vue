<template>
  <div v-for="item in formItems" :key="[...paths, item.prop].join('.')">
    <form-item
        v-if="item.type !== 'list'"
        :type="item.type"
        :label="item.label"
        :prop="item.prop"
        :rules="item.rules"
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
        <el-icon @click="handleAdd( item)" style="cursor:pointer;">
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
              :rules="subItem.rules"
              :paths="[...paths, ...(item.subPaths || []), item.prop, $index, subItem.prop]"
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
  <div v-if="loading" style="font-size: 14px; text-align: center;line-height: 22px;">加载中...</div>
</template>

<script setup lang="ts">
import FormItem from "./FormItem.vue"
import { Delete, CirclePlusFilled } from "@element-plus/icons-vue"
import {getPropByPath, resolveSchemas} from "../utils"
import {reactive, watch} from "vue";

const props = defineProps<{
  schemas: any[]
  model: any,
  paths: any[]
}>()

let formItems = $ref([])
let loading = $ref(false)

// 由于深度watch整个表单对象，为了性能这里需要降频
// 保证第一次立即执行，最后一次一定执行
function debounce(fn, delay) {
    let prevTime
    let timer = null
    return function () {
      const now = Date.now()
      const gap = now - prevTime
      if (!prevTime || gap > delay) {
        fn.apply(this, arguments)
      } else {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, gap);
      }
      prevTime = now
  };
}

const getAllSchemas = () => {
  return fetch("http://127.0.0.1:5000/getAllSchemas")
  .then(res => res.json())
  .then((data) => data)
}

watch(() => props.model, debounce(async () => {
  loading = true
  const newFormItems = []
  async function process(schemas) {
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i]
      newFormItems.push(schema)
      const model = getPropByPath(props.model, schema.subPaths)
      if (!(schema.prop in model)) {
        model[schema.prop] = schema.default
        if (["checkboxGroup", "list"].includes(schema.type) && !model[schema.prop]) {
          model[schema.prop] = reactive([])
        }
      }
      if (schema.getOptions && !schema.isOptionsReady) {
        // 异步拉取options
        schema.isOptionsReady = true
        schema.getOptions({
          getAllSchemas
        }).then((options) => {
          schema.isOptionsReady = true
          schema.options = options
        }).catch(() => {
          schema.isOptionsReady = false
        })
      }

      const effect = schema.effect?.({ model, schemas, resolveSchemas })
      if (!effect) {
        continue
      }
      if (Array.isArray(effect)) {
        await process(effect.map(item => ({
          ...item,
          subPaths: schema.subPaths
        })))
      } else {
        if (!model[effect.prop]) {
          model[effect.prop] = reactive({})
        }
        await process((await effect.schemas).map(item => ({
          ...item,
          subPaths: [...(schema.subPaths || []), effect.prop]
        })))
      }
    }
  }
  await process(props.schemas)
  formItems = newFormItems
  loading = false
}, 600), {
  immediate: true,
  deep: true
})

function handleAdd(item) {
  const newModel = {}
  item.schemas.forEach((schema) => {
    newModel[schema.prop] = schema.default
  })
  getPropByPath(props.model, item.subPaths)[item.prop].push(newModel)
}

</script>