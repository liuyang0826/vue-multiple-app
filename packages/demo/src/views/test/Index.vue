<template>
  <div class="container">
    <div style="display: flex; justify-content: flex-end">
      <div class="table-tool">
        <el-button size="mini" type="danger" plain :disabled="!selections.length" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>
    </div>
    <el-table
      size="small"
      border
      style="margin-top: -6px"
      :data="tableData"
      v-loading="pending"
      ref="tableRef"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column type="index" label="序号" width="55" align="center" :index="indexMethod" />
      <el-table-column label="操作" width="176">
        <template v-slot:default="{ row }">
          <el-button size="small" type="text" @click="handleDelete(row)">删除</el-button>
          <el-divider direction="vertical" />
          <el-button size="small" type="text" @click="handleMove(row, 1)">上移</el-button>
          <el-divider direction="vertical" />
          <el-button size="small" type="text" @click="handleMove(row, 0)">下移</el-button>
        </template>
      </el-table-column>
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
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, watch, nextTick } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getTableData, doDelete, doBatchDelete, doMove } from './services'

const query = reactive({})
let pending = $ref(false)
let pageSize = $ref(10)
let pageNum = $ref(1)
let total = $ref(0)
let tableData = $ref([])
let selectionLen = 0
let selectionMap = $ref({})
const rowKey = 'id'
const selections = $computed(() => Object.values(selectionMap))
const tableRef = $ref()
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
    nextTick(() => {
      tableData.forEach(row => {
        tableRef.toggleRowSelection(row, !!selectionMap[row[rowKey]])
      })
      selectionLen = tableData.filter(row => !!selectionMap[row[rowKey]]).length
    })
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
// 删除
function handleDelete() {
  ElMessageBox.confirm('确认删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { status, message } = await doDelete(row.id)
    if (status) {
      ElMessage.success('操作成功')
      updateTable()
    } else {
      ElMessage.error(message)
    }
  })
}
// 翻页多选相关方法
function resetSelection(selectedRows) {
  selectionMap = selectedRows ? selectedRows.reduce((acc, row) => ({ ...acc, [row[rowKey]]: row }), {}) : {}
  selectionLen = data.filter(row => !!selectionMap[row[rowKey]]).length
}
function handleSelect(selection, row) {
  if (selectionLen < selection.length) {
    selectionMap[row[rowKey]] = row
  } else {
    delete selectionMap[row[rowKey]]
  }
  selectionLen = selection.length
}
function handleSelectAll(selection) {
  if (selection.length) {
    selection.forEach(row => {
      selectionMap[row[rowKey]] = row
    })
  } else {
    tableData.forEach(row => {
      delete selectionMap[row[rowKey]]
    })
  }
  selectionLen = selection.length
}
// 批量删除
function handleBatchDelete() {
  ElMessageBox.confirm('确认删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { status, message } = await doBatchDelete(row.id)
    if (status) {
      ElMessage.success('操作成功')
      updateTable()
    } else {
      ElMessage.error(message)
    }
  })
}
// 启用禁用
async function handleToggle(row) {
  const { status, message } = await doToggleEnable(row.id)
  if (status) {
    ElMessage.success('操作成功')
    updateTable()
  } else {
    ElMessage.error(message)
  }
}
// 上移下移
async function handleMove(row) {
  const { status, message } = await doMove(row.id)
  if (status) {
    ElMessage.success('操作成功')
    updateTable()
  } else {
    ElMessage.error(message)
  }
}
</script>

<style>
.container {
  background: #fff;
  padding: 10px;
}
</style>
