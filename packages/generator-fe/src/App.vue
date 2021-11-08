<template>
  <div id="app">
    <h1>配置生成页面</h1>
    <el-form size="small" inline>
      <el-form-item label="选择模板">
        <el-select v-model="form.templateId">
          <el-option v-for="item in templates" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <div>组件配置</div>
      <template v-for="(item, index) in templateForm">
        <template v-if="['text', 'number', 'select', 'boolean'].includes(item.type)">
          <el-form-item :key="index" :label="item.label">
            <el-input v-if="['text', 'number'].includes(item.type)" :type="item.type" v-model="form.options[item.prop]" />
            <el-select v-if="item.type === 'select'" v-model="form.options[item.prop]">
              <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"/>
            </el-select>
            <el-select v-if="item.type === 'boolean'" v-model="form.options[item.prop]">
              <el-option v-for="option in [{ label: '是', value: true }, { label: '否', value: false }]" :key="option.value" :label="option.label" :value="option.value"/>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="item.type === 'array'">
          <div :key="index">
            <div>{{ item.label }}</div>
            <el-table :data="[]">
              <el-table-column v-for="(option, index) in item.items" :key="index" :label="option.label" />
            </el-table>
<!--            <div v-for="(option) in item"></div>-->
            <button @click="handleAdd(item, form.options)">增加</button>
          </div>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      form: {
        options: {}
      },
      templates: [],
    }
  },
  computed: {
    templateForm() {
      return this.templates.find(d => d.id === this.form.templateId)?.templateForm || []
    }
  },
  created () {
    fetch("http://127.0.0.1:9000/templates")
    .then(res => res.json())
    .then((data) => {
      this.templates = data
    })
  },
  methods: {
    handleAdd(item, options) {
      this.$set(options, item.prop, [{}])
    }
  }
}
</script>

<style>
#app {
  width: 800px;
  margin: auto;
}
</style>
