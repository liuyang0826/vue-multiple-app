const inquirer = require("inquirer");

async function normalTable() {
    const result = {}

    const { name, tableCols } = await inquirer.prompt([
        {
            type: "input",
            message: "组件名称:",
            name: "name",
            filter: (val) => val.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toUpperCase() + $2)
        },
        {
            type: "number",
            message: "表格列数:",
            name: "tableCols"
        },
    ])
    result.name = name

    const options = {}

    result.options = options

    options.tableCols = await promptTableCols({ prefix: "表格列", length: tableCols })

    const { useSearchForm, formItems } = await inquirer.prompt([
        {
            type: "confirm",
            message: "添加查询表单？",
            name: "useSearchForm",
            default: false
        },
        {
            type: "number",
            message: "个数:",
            name: "formItems",
            default: 0,
            prefix: "表单项",
            when: (answer) => answer.useSearchForm
        },
    ])

    if (useSearchForm) {
        options.formItems = await promptFormItems({ length: formItems })
    }

    const { hasPagination, hasAddForm } = await inquirer.prompt([
        {
            type: "confirm",
            message: "是否分页？",
            name: "hasPagination",
            default: true
        },
        {
            type: "confirm",
            message: "是否添加功能？",
            name: "hasAddForm",
            default: false
        },
    ])

    options.hasPagination = hasPagination

    if (hasAddForm) {

    }

    console.log(JSON.stringify(result, null, 2));
}

normalTable()

async function promptTableCols({ prefix = "表单项", length }) {
    const result = []

    for (let i = 0; i < length; i++) {
        console.log(`------------${prefix}${i + 1}------------`)
        const item = await inquirer.prompt([
            {
                type: "input",
                message: `label:`,
                name: `label`,
            },
            {
                type: "input",
                message: `prop:`,
                name: `prop`,
            },
        ])
        result.push(item)
    }

    return result
}

async function promptFormItems({ prefix = "表单项", length }) {
    const result = []

    for (let i = 0; i < length; i++) {
        console.log(`------------${prefix}${i + 1}------------`)
        const item = await inquirer.prompt([
            {
                type: "list",
                message: `类型:`,
                name: "type",
                choices: ["input", "select"],
            },
            {
                type: "input",
                message: `label:`,
                name: `label`,
            },
            {
                type: "input",
                message: `prop:`,
                name: `prop`,
            },
            {
                type: "list",
                message: `数据源:`,
                name: "source",
                choices: ["接口", "固定项"],
                when: (answer) => answer.type === "select"
            },
            {
                type: "input",
                message: `数据源接口:`,
                name: "api",
                when: (answer) => answer.type === "select" && answer.source === "接口"
            },
            {
                type: "input",
                message: `数据源依赖表单项prop:`,
                name: "dep",
                when: (answer) => answer.type === "select" && answer.source === "接口"
            },
            {
                type: "number",
                message: `固定项个数:`,
                name: "count",
                when: (answer) => answer.type === "select" && answer.source === "固定项"
            },
        ])
        const length = item.count

        if (length) {
            item.options = await promptSelectOptions({ length, prefix: `${prefix}${i + 1} 固定项` })
        }

        if (!item.dep) {
            delete item.dep
        }

        result.push(item)
    }

    return result
}

async function promptSelectOptions({ prefix = '', length }) {
    const result = []

    for (let i = 0; i < length; i++) {
        console.log(`------------${prefix}${i + 1}------------`)
        result[i] = await inquirer.prompt([
            {
                type: "input",
                message: `label:`,
                name: "label",
            },
            {
                type: "input",
                message: `value:`,
                name: "value",
            },
        ])
    }

    return result
}