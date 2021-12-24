declare interface ISchema {
    type: string
    prop: string
    label: string
    schemas: ISchema | ISchema[]
}

declare interface IFormItem extends ISchema {

}

declare interface IContext {
    model: any
    schemas: ISchema[]
    path: string[]
    formItems: IFormItem[]
}

declare global {
    function _resolveSchema(schemas: ISchema[]): void
}