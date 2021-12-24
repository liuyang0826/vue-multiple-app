const firstToUpperCase = (str) => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toUpperCase() + $2)

const split = (str, separator) => str.split(separator)

module.exports = {
    firstToUpperCase,
    split,
}