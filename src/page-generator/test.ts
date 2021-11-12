import {scanner} from "./scanner";
import writeFile from "./write-file";

scanner()

writeFile({
    "templateId": "table",
    "name": "Test",
    "options": {
        "tableCols": [
            {
                "label": "name",
                "prop": "name"
            }
        ],
        "api": "/da",
        "formItems": [
            {
                "type": "input",
                "label": "21",
                "prop": "eq"
            }
        ],
        "hasPager": true,
        "addForm": {
            "templateId": "dialog-form",
            "name": "Add",
            "options": {
                "title": "sa",
                "formItems": [
                    {
                        "type": "input",
                        "label": "321",
                        "prop": "a",
                        "required": true,
                        "width": 90
                    },
                    {
                        "type": "input",
                        "label": "ewq",
                        "prop": "ewq",
                        "required": false,
                        "width": 90
                    },
                    {
                        "type": "input",
                        "label": "ewq",
                        "prop": "eqw",
                        "required": false,
                        "width": 90
                    },
                    {
                        "type": "input",
                        "label": "eqw",
                        "prop": "eqw",
                        "required": false,
                        "width": 90
                    },
                    {
                        "type": "input",
                        "label": "eqw",
                        "prop": "eqw",
                        "required": false,
                        "width": 90
                    },
                    {
                        "type": "input",
                        "label": "ewq",
                        "prop": "eq",
                        "required": false,
                        "width": 90
                    },
                    {
                        "type": "input",
                        "label": "wq",
                        "prop": "ewq",
                        "required": false,
                        "width": 90
                    },
                    {
                        "type": "input",
                        "label": "q",
                        "prop": "ewq",
                        "required": false,
                        "width": 90
                    }
                ],
                "api": "ewq"
            },
            "components": []
        },
        "updateForm": {
            "templateId": "dialog-form",
            "name": "Eq",
            "options": {
                "title": "ewq",
                "formItems": [],
                "api": "eqw"
            },
            "components": []
        }
    },
    "components": []
})