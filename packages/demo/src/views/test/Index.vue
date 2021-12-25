<template>
  <div class="container">
    <div style="display: flex; justify-content: flex-end">
      <div class="table-tool">
        <el-button size="mini" :icon="Plus" @click="handleAdd" type="primary">添加</el-button>
      </div>
    </div>
    <el-table size="small" border style="margin-top: -6px" :data="tableData" v-loading="pending" ref="tableRef">
      <el-table-column type="index" label="序号" width="55" align="center" :index="indexMethod" />
    </el-table>
    <el-pagination
      style="margin-top: 16px; text-align: right"
      small
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="pageNum"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
    />
    <add-form v-model="add.visible" :data="add.data" :title="add.title" />
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import AddForm from './components/AddForm.vue'
import { getTableData } from './services'

const query = reactive({})
let pending = $ref(false)
let pageSize = $ref(10)
let pageNum = $ref(1)
let total = $ref(0)
let tableData = $ref([])
// 获取表格数据
async function updateTable() {
  pending = true
  try {
    const { status, data, message } = await getTableData({
      query,
      pageNum,
      pageSize
    })
    if (status) {
      tableData = data.result
      total = data.total
      tableData = [{}]
    } else {
      ElMessage.error(message)
    }
  } finally {
    pending = false
  }
}

function handleSearch() {
  handleCurrentChange(1)
}
function handleCurrentChange(val) {
  pageNum = val
  updateTable()
}

function handleSizeChange(val) {
  pageSize = val
  updateTable()
}
// 翻页序号
const indexMethod = index => pageSize * (pageNum - 1) + index + 1
onBeforeMount(handleSearch)
// 新增
const add = reactive({
  visible: false,
  data: {},
  title: ''
})
function handleAdd() {
  add.visible = true
  add.data = {}
  add.title = '21'
}
</script>

<style>
.container {
  background: #fff;
  padding: 10px;
}
</style>
