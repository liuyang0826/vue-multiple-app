<template>
  <div class="container">
    <div style="display: flex">
      <el-form size="mini" inline style="flex: 1">
        <el-form-item label="项目名称">
          <el-input clearable v-model="query.name" @change="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table size="small" border style="margin-top: -6px" :data="tableData" v-loading="pending" ref="tableRef">
      <el-table-column type="index" label="序号" width="55" align="center" :index="indexMethod" />
      <el-table-column label="项目名称" prop="name" />
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
import { reactive, onBeforeMount, watch } from 'vue'
import { getTableData } from '../services/project'

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
</script>

<style>
.container {
  background: #fff;
  padding: 10px;
}
</style>
