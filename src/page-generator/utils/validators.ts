export const propValidator = (input: string) => /^\w+$/.test(input)

export const requiredValidator = (input: string) => !!input?.length