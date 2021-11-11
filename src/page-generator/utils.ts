export const replace = (
    input: string,
    re: RegExp,
    replacer: (match: RegExpExecArray) => string
) => {
    let match
    let remaining = input
    let rewritten = ''
    while ((match = re.exec(remaining))) {
        rewritten += remaining.slice(0, match.index)
        rewritten += replacer(match)
        remaining = remaining.slice(match.index + match[0].length)
    }
    rewritten += remaining
    return rewritten
}

export const injectTemplate = (template: string, options: any, indent = 0) => {
    return replace(template, /<%(\w+?)%>/, ([matched, key]) => {
        return options[key] || matched
    }).replace(/\n/g, `\n${Array.from({length: indent}).map(() => " ").join("")}`)
}

export const firstToLowerCase = (str: string) => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toLowerCase() + $2)
export const firstToUpperCase = (str: string) => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toUpperCase() + $2)
export const camelCaseToShortLine = (str: string) => firstToUpperCase(str).replace(/[A-Z]/g, (a) => `-${a.toLowerCase()}`).slice(1)

export const prettier = (template: string) => replace(template, /<%(\w+?)%>/, () => "").replace(/\n\s+\n/g, "\n")

export const makeCamelCase = (first: string, ...args: string[]) => `${first}${args.map(str => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toUpperCase() + $2)).join("")}`

// 判断表单项是否有option选项
export const judgeType = (type: string) => ["select", "radio"].includes(type);
