<template>
  <div class="pane" :class="{ closed }">
    <div class="wrap">
      <div class="content">
        <el-form :model="context.model" :rules="rules" size="mini">
          <FormPane :context="context" />
        </el-form>
      </div>
    </div>
    <div class="footer">
      <el-button size="mini" type="primary" @click="handleSubmit">保存</el-button>
    </div>
    <button class="toggle" type="button" @click="closed = !closed">
      <el-icon>
        <arrow-left-bold v-if="closed"  />
        <arrow-right-bold v-else  />
      </el-icon>
    </button>
  </div>
  <iframe :src="route.query.path" style="width: 100vw;height: 100vh;display: block;border: none;" />
</template>

<script setup lang="ts">
import FormPane from "./components/form/FormPane.vue"
import {onBeforeMount, onMounted, reactive, toRaw} from "vue";
import { ArrowRightBold, ArrowLeftBold } from "@element-plus/icons-vue"
import {useRoute} from "vue-router"
import { mapFormItems } from "./utils"

const route = useRoute()
const rules = reactive({})

const context = reactive({
  formItems: [],
  schemas: [],
  model: JSON.parse(`{"tableCols":[],"searchItems":[],"hasAdd":true,"hasIndex":true,"hasPagination":true,"addForm":{"formItems":[{"label":"用户名","prop":"name","required":true,"tips":"用户名用户名用户名用户名用户名"}]}}`),
  path: []
})

onMounted(() => {
  const script = document.createElement("script")
  script.src = "http://127.0.0.1:5000/getSchemaById?id=1"
  window._resolveSchema = function (_schemas) {
    context.schemas = _schemas
    delete window._resolveSchema
    mapToFormItems()
  }
  document.head.appendChild(script)
})

function mapToFormItems() {
  mapFormItems(context)
}

const closed = $ref(false)

function handleSubmit() {
  fetch("http://127.0.0.1:5000/submit", {
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(context.model)
  })
}

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  position: relative;
  background: #f2f7f8;
}

.pane {
  position: fixed;
  left: 100%;
  top: 0;
  bottom: 0;
  z-index: 10;
  background: #fff;
  transition: .3s ease;
  transform: translateX(-100%);
}

.pane.closed {
  transform: translateX(0);
}

.wrap {
  height: 100%;
  overflow: auto;
  padding-bottom: 28px;
}

.content {
  width: 640px;
  padding: 12px;
}

.table-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 6px;
  color: rgb(96, 98, 102);
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #eaeaea;
  padding: 6px 12px;
  display: flex;
  justify-content: flex-end;
  z-index: 100;
}

.toggle {
  position: absolute;
  left: -18px;
  bottom: 50%;
  width: 18px;
  height: 60px;
  background: #fff;
  outline: none;
  border: none;
  border-radius: 18px;
  z-index: 100;
  cursor: pointer;
}
</style>