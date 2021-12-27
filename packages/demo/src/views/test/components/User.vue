<template>
  <div class="container">
    <div style="display: flex">
      <el-form size="mini" inline style="flex: 1">
        <el-form-item label="姓名">
          <el-input clearable v-model="query.name" @change="handleSearch" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select clearable v-model="query.sex" @change="handleSearch" placeholder="请选择性别">
            <el-option v-for="{ label, value } in sexOptions" :key="value" :value="value" :label="label" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input clearable v-model="query.age" @change="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="table-tool">
        <el-button size="mini" type="danger" plain :disabled="!selections.length" @click="handleBatchDelete">
          批量删除
        </el-button>
        <el-button size="mini" :icon="Plus" @click="handleAdd" type="primary">添加</el-button>
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
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="55" align="center" :index="indexMethod" />
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="性别" prop="sex" width="200" />
      <el-table-column label="年龄" prop="age" width="200" />
      <el-table-column label="是否可用" prop="enable" width="200" />
      <el-table-column label="操作" width="176">
        <template #default="{ row }">
          <el-button size="small" type="text" @click="handleUpdate(row)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="small" type="text" @click="handleDelete(row)">删除</el-button>
          <el-divider direction="vertical" />
          <el-button size="small" type="text" @click="handleToggleEnable(row)">
            {{ row.enable ? '禁用' : '启用' }}
          </el-button>
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
    <add-form v-model="add.visible" :data="add.data" :title="add.title" />
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, watch, nextTick } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import AddForm from './UserAddForm.vue'
import { getTableData, doDelete, doBatchDelete, doMove } from '../services/user'

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
let sexOptions = [
  { label: '男', value: '1' },
  { label: '女', value: '2' }
]
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
// 新增
const add = reactive({
  visible: false,
  data: {},
  title: ''
})
function handleAdd() {
  add.visible = true
  add.data = {}
  add.title = '新增用户'
}
//编辑
const update = reactive({
  visible: false,
  data: {},
  title: ''
})
function handleUpdate(row) {
  update.visible = true
  update.data = row
  update.title = '编辑用户'
}
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
async function handleToggleEnable(row) {
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
