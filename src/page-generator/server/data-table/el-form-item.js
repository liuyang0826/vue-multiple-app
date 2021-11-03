const selectOptions = require("./select-option")

const elInputProps = [
    { label: "名称", prop: "label" },
    { label: "字段名", prop: "prop" },
    { label: "最大长度", prop: "maxlength" },
]

const elSelectProps = [
    { label: "名称", prop: "label" },
    { label: "字段名", prop: "prop" },
    { label: "选项", prop: "options" },
    { label: "选项", prop: "options" },
]

module.exports = {
    elInputProps,
    elSelectProps,
}