export enum IComponentEnum {
    page = "page",
    component = "component"
}

// 组件配置项类型
export interface IComponentConfig<T extends {} = {}> {
    templateId: string // 组件模板id
    name: string // 组件名称
    namespace?: string // 组件变量命名空间
    options: T // 组件内部配置项
    components?: IComponentConfig[] // 子组件
}

// 模板处理函数
export type IProcessTemplate<T = {}> = (config: IComponentConfig<T>, type: IComponentEnum) => {
    name: string // 组件名称
    template: string // 处理完成的组件模板内容
    hooks?: string[] // 依赖的hook方法
    components?: IComponentConfig[] // 子组件
    services?: IService[] //依赖的 service
}

// 子组件注入父组件的处理函数
export type IInjectParent<T = {}> = (config: IComponentConfig<T>) => {
    hooks: string[]
    props: string[]
}

// service 接口函数类型
export interface IService {
    name: string // 函数名
    method: "get" | "post" | "put" | "delete" // 请求的http method
    api: string // 接口 api 的 url
}

export interface IOption {
    value: string
    label: string
}

export interface IFormItem {
    type: "input" | "select" // 表单项类型
    options?: IOption[] // 下拉框选项
    api?: string // 下拉框依赖的数据接口
    dep?: string // 依赖的其他的表单项的id
    label: string
    prop: string
    disabled: string
}
