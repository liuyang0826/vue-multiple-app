const replace = (input, re, replacer) => {
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

const injectTemplate = (template, options, indent = 0) => {
    return replace(template, /<%(\w+?)%>/, ([matched, key]) => {
        return options[key] || matched
    }).replace(/\n/g, `\n${Array.from({length: indent}).map(() => " ").join("")}`)
}

const firstToLowerCase = str => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toLowerCase() + $2)
const firstToUpperCase = str => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toUpperCase() + $2)
const componentNameToTagName = str => firstToUpperCase(str).replace(/[A-Z]/g, (a) => `-${a.toLowerCase()}`).slice(1)

const finishInject = template => replace(template, /<%(\w+?)%>/, () => "").replace(/\n\s+\n/g, "\n")

module.exports = {
    injectTemplate,
    firstToLowerCase,
    firstToUpperCase,
    componentNameToTagName,
    replace,
    finishInject,
}