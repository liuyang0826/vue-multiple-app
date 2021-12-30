<template>
  <el-config-provider :locale="zhCn">
    <div class="pane" :class="{ closed }">
      <div class="wrap">
        <div class="content">
          <el-form
              :model="model"
              :rules="rules"
              size="mini"
              ref="formRef"
              class="list-wrap"
              :style="{gridTemplateColumns: `repeat(${cols || 1},minmax(0,1fr))`}"
          >
            <FormPane :schemas="schemas" :model="model" :paths="[]" />
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
  </el-config-provider>
  <iframe :src="route.query.path" style="width: 100vw;height: 100vh;display: block;border: none;" />
</template>

<script setup lang="ts">
import FormPane from "./components/FormPane.vue"
import {onMounted, provide} from "vue";
import { ArrowRightBold, ArrowLeftBold } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import {useRoute} from "vue-router"
import { resolveSchemas } from "./utils"
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const route = useRoute()
const rules = $ref({})

let model = $ref({})
let schemas = $ref({})
let cols = $ref(1)

provide("model", model)

onMounted(async () => {
  const result = await resolveSchemas("tree")
  schemas = result.schemas
  cols = result.cols
})

onMounted(async () => {
  fetch("http://127.0.0.1:5000/getHistoryForm?id=tabs")
  .then(res => res.json())
  .then(data => {
    model = data
  })
})

const closed = $ref(false)
const formRef = $ref()

function handleSubmit() {
  formRef.validate((flag, err) => {
    if (flag) {
      fetch("http://127.0.0.1:5000/submit?id=tree", {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
      })
    } else {
      ElMessage.warning(Object.values(err)[0][0].message)
    }
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
  margin-bottom: 8px;
  color: rgb(96, 98, 102);
}

.list-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 8px;
  color: rgb(96, 98, 102);
  height: 28px;
}

.move {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  margin-right: 4px;
}

.list-wrap {
  display: grid;
  gap: 0 12px;
}

.group {
  border: 1px solid #eaeaea;
  padding: 10px;
  border-radius: 2px;
  margin-bottom: 8px;
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

body .el-drawer {
  overflow: auto;
  font-size: 14px;
}

body .el-drawer__header {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  border-bottom: 1px solid #eaeaea;
  padding-top: 16px;
  padding-bottom: 12px;
  margin-bottom: 0;
}

body .el-dialog__body {
  padding-top: 16px;
  padding-bottom: 0px;
}

body .el-dialog__footer {
  padding-top: 12px;
  padding-bottom: 16px;
  border-top: 1px solid #eaeaea;
}

body .el-form-item__label {
  padding-right: 4px;
}

body .el-popconfirm__icon {
  margin-top: -2px;
}
</style>