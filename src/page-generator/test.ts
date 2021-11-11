import {scanner} from "./scanner";
import writeFile from "./write-file";

scanner()

writeFile({
    "templateId": "table",
    "name": "Test",
    "options": {
        "formItems": [
            {
                "type": "input",
                "label": "用户名",
                "prop": "name"
            },
            {
                "type": "select",
                "label": "性别",
                "prop": "sex",
                "source": "固定项",
                "count": 2,
                "options": [
                    {
                        "label": "男",
                        "value": "1"
                    },
                    {
                        "label": "女",
                        "value": "2"
                    }
                ]
            },
            {
                "type": "select",
                "label": "尺寸",
                "prop": "size",
                "source": "接口",
                "api": "/api/sizes",
                "deps": ["sex"]
            },
            {
                "type": "input",
                "label": "年龄",
                "prop": "age"
            }
        ],
        "tableCols": [
            {
                "label": "用户名",
                "prop": "name"
            },
            {
                "label": "性别",
                "prop": "sex"
            },
            {
                "label": "年龄",
                "prop": "age"
            },
            {
                "label": "尺寸",
                "prop": "size"
            }
        ],
        "api": "/api/pageList",
        "hasPager": true,
        "addForm": {
            "templateId": "dialog-form",
            "name": "AddForm",
            "options": {
                "title": "新增用户",
                "width": 440,
                "formItems": [
                    {
                        "type": "input",
                        "label": "用户名",
                        "prop": "name"
                    },
                    {
                        "type": "radio",
                        "label": "性别",
                        "prop": "sex",
                        "source": "固定项",
                        "count": 2,
                        "options": [
                            {
                                "label": "男",
                                "value": "1"
                            },
                            {
                                "label": "女",
                                "value": "2"
                            }
                        ]
                    },
                    {
                        "type": "select",
                        "label": "尺寸",
                        "prop": "size",
                        "source": "接口",
                        "api": "/api/sizes",
                        "deps": ["sex"]
                    },
                    {
                        "type": "input",
                        "label": "年龄",
                        "prop": "age"
                    }
                ],
                "api": "/api/addUser"
            }
        },
        "updateForm": {
            "templateId": "dialog-form",
            "name": "UpdateForm",
            "options": {
                "title": "编辑用户",
                "width": 440,
                "formItems": [
                    {
                        "type": "input",
                        "label": "用户名",
                        "prop": "name"
                    },
                    {
                        "type": "select",
                        "label": "性别",
                        "prop": "sex",
                        "source": "固定项",
                        "count": 2,
                        "options": [
                            {
                                "label": "男",
                                "value": "1"
                            },
                            {
                                "label": "女",
                                "value": "2"
                            }
                        ]
                    },
                    {
                        "type": "input",
                        "label": "年龄",
                        "prop": "age"
                    },
                    {
                        "type": "select",
                        "label": "尺寸",
                        "prop": "szie",
                        "source": "接口",
                        "api": "/api/sizes",
                        "deps": ["sex"]
                    }
                ],
                "api": "/api/updateUser"
            }
        },
        "deleteApi": "/api/delete",
        "batchDeleteApi": "/api/batchDelete",
        "toggleEnableApi": "/api/toggleEnable",
        "moveApi": "/api/move",
        "exportApi": "/api/export",
        "hasSelection": true
    },
    "components": []
})