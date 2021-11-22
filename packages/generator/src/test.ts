import {scanner} from "./scanner";
import writeFile from "./write-file";

scanner()

writeFile({
    "templateId": "table",
    "name": "Test",
    "options": {
        "tableCols": [
            {
                "label": "姓名",
                "prop": "name"
            },
            {
                "label": "性别",
                "prop": "sex"
            }
        ],
        "api": "/api/pageList",
        "formItems": [
            {
                "type": "input",
                "label": "用户名",
                "prop": "name"
            },
        ],
        "hasPager": true,
        "hasIndex": true,
        "deleteApi": "xxx",
        "batchDeleteApi": "xxx",
        "toggleEnableApi": "xxx",
        "moveApi": "xxx",
        "addForm": {
            "templateId": "dialog-form",
            "name": "AddForm",
            "options": {
                "title": "新增用户",
                "formItems": [
                    {
                        "type": "input",
                        "label": "用户名",
                        "prop": "name",
                        "required": true,
                        "labelWidth": 96
                    },
                    {
                        "type": "input",
                        "label": "年龄",
                        "prop": "age",
                        "required": true,
                        "labelWidth": 96
                    },
                    {
                        "type": "input",
                        "label": "性别",
                        "prop": "sex",
                        "required": true,
                        "labelWidth": 96
                    },
                    {
                        "type": "input",
                        "label": "身份证号",
                        "prop": "code",
                        "required": true,
                        "labelWidth": 96
                    },
                    {
                        "type": "input",
                        "label": "电话号码",
                        "prop": "phone",
                        "required": true,
                        "labelWidth": 96
                    },
                    {
                        "type": "input",
                        "label": "地址",
                        "prop": "address",
                        "required": true,
                        "labelWidth": 96
                    },
                    {
                        "type": "input",
                        "label": "职务",
                        "prop": "job",
                        "required": true,
                        "labelWidth": 96
                    },
                    {
                        "type": "input",
                        "label": "尺寸",
                        "prop": "size",
                        "required": true,
                        "labelWidth": 96
                    }
                ],
                "width": 732,
                "api": ""
            },
            "components": []
        }
    },
    "components": []
})