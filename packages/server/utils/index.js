const firstToUpperCase = (str) => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toUpperCase() + $2)
const firstToLowerCase = (str) => str.replace(/\b(\w)(\w*)/, ($0, $1, $2) => $1.toLowerCase() + $2)
const camelCaseToShortLine = (str) => firstToUpperCase(str).replace(/[A-Z]/g, (a) => `-${a.toLowerCase()}`).slice(1)
const split = (str, separator) => str.split(separator)

module.exports = {
  firstToUpperCase,
  firstToLowerCase,
  camelCaseToShortLine,
  split,
}