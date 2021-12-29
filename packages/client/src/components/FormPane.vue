<template>
  <template v-for="item in formItems">
    <div
        :key="[...paths, item.prop].join('.')"
        v-if="item.type === 'table'"
        :style="itemStyle(item)"
    >
      <div class="table-title">
        <span>{{item.label}}：</span>
        <!--<el-icon @click="handleAdd( item)" style="cursor:pointer;">
          <circle-plus-filled />
        </el-icon>-->
      </div>
      <el-table :data="getPropByPath(model, item.subPaths)[item.prop]" border size="mini" stripe style="margin-bottom: 8px;">
        <el-table-column
            v-for="subItem in item.schemas"
            :label="subItem.label"
            :width="subItem.width"
            :min-width="subItem.width || 160"
            :align="['list', 'code', 'more'].includes(subItem.type) ? 'center' : 'left'"
        >
          <template v-if="subItem.tips" #header="{ column }">
            <div style="display: inline-flex;align-items: center;">
              {{column.label}}
              <el-tooltip style="margin-left: 2px" effect="light"  placement="top">
                <el-icon size="mini">
                  <warning />
                </el-icon>
                <template #content>
                  <div v-html="subItem.tips"></div>
                </template>
              </el-tooltip>
            </div>
          </template>
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
              :code-mode="subItem.codeMode"
              :dialog-width="subItem.dialogWidth"
              is-inner-table
              @update:modelValue="effect"
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
      <el-button @click="handleAdd(item)" style="width: 100%;margin-bottom: 16px;">增加{{item.label}}</el-button>
    </div>
    <div
        :key="[...paths, item.prop].join('.')"
        v-else-if="item.type === 'list'"
        :style="itemStyle(item)"
    >
      <div class="table-title">
        <span>{{item.label}}：</span>
      </div>
      <div
          v-for="(row, $index) in getPropByPath(model, item.subPaths)[item.prop]"
          :key="$index"
          class="group"
      >
        <div class="list-title">
          <span style="flex: 1;">{{item.label}} #{{$index + 1}}</span>
          <el-popconfirm title="确定删除？" @confirm="getPropByPath(model, item.subPaths)[item.prop].splice($index, 1)">
            <template #reference>
              <el-icon style="cursor:pointer;">
                <remove-filled />
              </el-icon>
            </template>
          </el-popconfirm>
        </div>
        <div class="list-wrap" :style="{gridTemplateColumns: `repeat(${item.cols || 1},minmax(0,1fr))`}">
          <FormPane :schemas="item.schemas" :paths="[...paths, ...(item.subPaths || []), item.prop, $index]" :model="row"/>
        </div>
      </div>
      <el-button @click="handleAdd(item)" style="width: 100%;margin-bottom: 12px;">增加{{item.label}}</el-button>
    </div>
    <div
        :key="item.key || [...paths, item.prop].join('.')"
        v-else-if="item.type === 'child'"
        class="group list-wrap"
        :style="{gridTemplateColumns: `repeat(${item.cols || 1},minmax(0,1fr))`, ...itemStyle(item)}"
    >
      <FormPane :schemas="item.schemas" :paths="[...paths, ...(item.subPaths || [])]" :model="getPropByPath(model, item.subPaths)"/>
    </div>
    <form-item
        v-else
        :key="[...paths, item.prop].join('.')"
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
        :code-mode="item.codeMode"
        :dialog-width="item.dialogWidth"
        :style="itemStyle(item)"
        @update:modelValue="effect"
    />
  </template>
  <div v-if="loading" style="font-size: 14px; text-align: center;line-height: 22px;grid-column: span 2 / span 2;">加载中...</div>
</template>

<script setup lang="ts">
import FormItem from "./FormItem.vue"
import { Delete, CirclePlusFilled, RemoveFilled, Bottom, Top, Warning } from "@element-plus/icons-vue"
import {getPropByPath, resolveSchemas} from "../utils"
import {onMounted, reactive, watch} from "vue";

const props = defineProps<{
  schemas: any[]
  model: any,
  paths: any[]
}>()

let formItems = $ref([])
let loading = $ref(false)

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

const effect = debounce(async () => {
  loading = true
  const newFormItems = []
  async function process(schemas) {
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i]
      newFormItems.push(schema)
      const model = getPropByPath(props.model, schema.subPaths)
      if (!(schema.prop in model)) {
        model[schema.prop] = schema.default
        if (["checkboxGroup", "list", "table"].includes(schema.type) && !model[schema.prop]) {
          const newModel = {}
          schema.schemas.forEach((schema) => {
            newModel[schema.prop] = schema.default
          })
          model[schema.prop] = [newModel]
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
          model[effect.prop] = {}
        }
        const { cols, schemas } = await effect.schemas
        newFormItems.push({
          ...effect,
          type: "child",
          schemas,
          cols,
          subPaths: [...(schema.subPaths || []), effect.prop]
        })
      }
    }
  }
  await process(props.schemas)
  formItems = newFormItems
  loading = false
}, 600)

watch(() => props.model, effect, {
  immediate: true
})

function handleAdd(item) {
  const newModel = {}
  item.schemas.forEach((schema) => {
    newModel[schema.prop] = schema.default
  })
  getPropByPath(props.model, item.subPaths)[item.prop].push(newModel)
}

function itemStyle(item) {
  return {
    gridColumn: `span ${item.colspan || 1}/span ${item.colspan || 1}`
  }
}
</script>