'use strict';

var schemas = "<script>\r\n  [\r\n      {type: \"text\", prop: \"title\", label: \"标题\",},\r\n      {\r\n          type: \"list\",\r\n          prop: \"formItems\",\r\n          label: \"表单项\",\r\n          schemas: [\r\n              {type: \"text\", prop: \"label\", label: \"字段名\",},\r\n              {type: \"text\", prop: \"prop\", label: \"后端字段\",},\r\n              {type: \"switch\", prop: \"required\", label: \"必填\", width: 60, default: true},\r\n              {type: \"text\", prop: \"tips\", label: \"提示内容\",},\r\n              {type: \"text\", prop: \"append\", label: \"后置内容\",},\r\n          ],\r\n      },\r\n      {type: \"text\", prop: \"api\", label: \"接口地址\",},\r\n      {\r\n          type: \"code\",\r\n          prop: \"paramsTransform\",\r\n          label: \"参数格式化\",\r\n          tips: `\r\n<div style=\"line-height: 20px;\">\r\n<p>自定义一个用于转换保存数据的方法，默认会原样提交整个form对象。</p>\r\n<p>须遵循ES规范，示例如下：</p>\r\n<div style=\"margin-top: 6px;background: #f2f4fa;padding: 4px 8px;\">\r\n<pre>\r\nexport default function(form) {\r\nreturn {\r\n  realName: form.name,\r\n  price: form.price * 100\r\n}\r\n}\r\n</pre>\r\n</div>\r\n</div>\r\n`\r\n      },\r\n  ]\r\n</script>";

var template = "<template>\r\n  <el-dialog :model-value=\"modelValue\" :title=\"title\" @update:modelValue=\"$emit('update:modelValue', $event)\" width=\"<%= $imports.autoFormWidth(formItems).dialogWidth %>px\" append-to-body :close-on-click-modal=\"false\">\r\n      <el-form :model=\"form\" size=\"small\" inline :rules=\"rules\" ref=\"formRef\" style=\"margin-right: -10px;\">\r\n          <% formItems.forEach(function(item, index){ %>\r\n              <el-form-item label=\"<%= item.label %>：\" prop=\"<%= item.prop %>\" label-width=\"<%= $imports.autoFormWidth(formItems).labelWidth[index] %>px\">\r\n                  <% if (item.tips) { %>\r\n                      <template #label>\r\n                          <div style=\"display: inline-flex;align-items: center;\">\r\n                              <%= item.label %>\r\n                              <el-tooltip style=\"margin-left: 2px;\" content=\"<%= item.tips %>\" placement=\"top\">\r\n                                  <el-icon size=\"mini\">\r\n                                      <Warning />\r\n                                  </el-icon>\r\n                              </el-tooltip>\r\n                              ：\r\n                          </div>\r\n                      </template>\r\n                  <% } %>\r\n                  <el-input\r\n                      clearable\r\n                      v-model=\"form.<%= item.prop %>\"\r\n                      placeholder=\"请输入<%= item.label %>\"\r\n                      style=\"width: <%= $imports.autoFormWidth(formItems).itemWidth %>px;\"\r\n                      <% if (!item.append) { %>/><% } %>\r\n                      <% if (item.append) { %>><% } %>\r\n                      <% if (item.append) { %><template #append><%= item.append %></template><% } %>\r\n                      <% if (item.append) { %></el-input><% } %>\r\n              </el-form-item>\r\n          <% }) %>\r\n      </el-form>\r\n      <template #footer>\r\n          <el-button size=\"small\" @click=\"$emit('update:modelValue', false)\">取消</el-button>\r\n          <el-button size=\"small\" type=\"primary\" :loading=\"loading\" @click=\"handleSubmit\">确定</el-button>\r\n      </template>\r\n  </el-dialog>\r\n</template>\r\n\r\n<script setup>\r\n  import { watch, nextTick } from \"vue\"\r\n  import { submit } from \"<%= $imports.getFilePath(\"service\") %>\"\r\n  import { ElMessage } from 'element-plus'\r\n  <% if ($imports.some(formItems, d => d.tips)) { %>\r\n  import { Warning } from \"@element-plus/icons-vue\"\r\n  <% } %>\r\n  const props = defineProps({\r\n      modelValue: Boolean,\r\n      title: String,\r\n      data: Object,\r\n  })\r\n  let form = $ref({})\r\n  let loading = $ref(false)\r\n  let formRef = $ref()\r\n  let rules = {\r\n      <% formItems.forEach(function (item){ %>\r\n      <% if (item.required) { %>\r\n      <%= item.prop %>: { required: true, message: \"请输入<%= item.label %>\", trigger: [\"change\", \"blur\"] },\r\n      <% } %>\r\n      <% }) %>\r\n  }\r\n  watch(() => props.modelValue, (visible) => {\r\n      if (visible) {\r\n          return\r\n      }\r\n      nextTick(() => {\r\n          loading = false\r\n          form = JSON.parse(JSON.stringify(props.data))\r\n          formRef.clearValidate()\r\n      })\r\n  })\r\n\r\n  <% if (paramsTransform) { %>\r\n  // 转换表单数据\r\n  <%- $imports.parseDefaultFunction(paramsTransform, \"paramsTransform\") %>\r\n  <% } %>\r\n\r\n  function handleSubmit() {\r\n      formRef.validate(async (flag) => {\r\n          if (flag) {\r\n              loading = true\r\n              try {\r\n                  const { status, message } = await submit(\r\n                      <% if (paramsTransform) { %>paramsTransform(<% } %>\r\n                          form\r\n                      <% if (paramsTransform) { %>)<% } %>\r\n                  )\r\n                  if (status) {\r\n                      ElMessage.success(\"操作成功\")\r\n                  } else {\r\n                      ElMessage.error(message)\r\n                  }\r\n              } finally {\r\n                  loading = false\r\n              }\r\n          }\r\n      })\r\n  }\r\n</script>";

function components({ name, data }) {
  return [
    {
      template,
      name,
      data
    }
  ]
}

function services({ name, data, utils }) {
  return [
    {
      name,
      services: [
        {
          name: "submit",
          method: "post",
          api: data.api,
        }
      ]
    }
  ]
}

var index = {
  schemas,
  components,
  services
};

module.exports = index;
