'use strict';

var schemas = "<script>\r\n  [\r\n      {\r\n          type: \"list\",\r\n          label: \"tabs项\",\r\n          prop: \"tabs\",\r\n          schemas: [\r\n              {type: \"text\", label: \"名称\", prop: \"label\"},\r\n              {type: \"text\", label: \"id\", prop: \"name\", rules: { required: true, trigger: [\"blur\", \"change\"], message: \"tab的id必须填写\" }},\r\n              {\r\n                  type: \"list\",\r\n                  label: \"配置组件\",\r\n                  width: 80,\r\n                  dialogWidth: 640,\r\n                  schemas: [\r\n                      {\r\n                          type: \"select\",\r\n                          label: \"选择组件\",\r\n                          prop: \"schemaId\",\r\n                          options: [\r\n                              { label: \"表格\", value: \"table\" }\r\n                          ],\r\n                          effect({ model, resolveSchemas }) {\r\n                              if (model.schemaId === \"table\") {\r\n                                  return {\r\n                                      prop: \"itemSchemas\",\r\n                                      schemas: resolveSchemas(\"table\")\r\n                                  }\r\n                              }\r\n                          }\r\n                      },\r\n                  ]\r\n              }\r\n          ]\r\n      }\r\n  ]\r\n</script>";

var template = "<template>\r\n    <el-tabs v-model=\"activeTabName\"  style=\"background: #fff; padding:  0 12px;\">\r\n        <% tabs.forEach(function (item) { %>\r\n            <el-tab-pane label=\"<%= item.label %>\" name=\"<%= item.name %>\">\r\n                <<%= $imports.camelCaseToShortLine(item.name) %> />\r\n            </el-tab-pane>\r\n        <% }) %>\r\n    </el-tabs>\r\n</template>\r\n\r\n<script setup>\r\n    <% tabs.forEach(function(item) { %>\r\n    import <%= item.name %> from \"<%= $imports.getFilePath(\"components\", item.name) %>\"\r\n    <% }) %>\r\n    const activeTabName = $ref(\"<%= tabs[0].name %>\")\r\n</script>";

function components({name, data, resolveComponents}) {
  return [
    {
      template,
      name,
      data,
    },
    ...data.tabs.map((item) => {
      return resolveComponents(item.schemaId, {
        data: item.itemSchemas,
        name: item.name,
      })
    })
  ]
}

function services({data, resolveServices}) {
  return [
    {},
    ...data.tabs.map((item) => resolveServices(item.schemaId, {
      data: item.itemSchemas,
      name: item.name
    }))
  ]
}

var index = {
  schemas,
  components,
  services
};

module.exports = index;
