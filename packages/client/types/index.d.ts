declare interface ISchema {
    type: string
    prop: string
    label: string
    schemas: ISchema | ISchema[]
}

declare interface IFormItem extends ISchema {

}

declare interface IContext {
    schemas: ISchema[]
    formItems: IFormItem[]
}

declare global {
    function _resolveSchema(schemas: ISchema[]): void
}