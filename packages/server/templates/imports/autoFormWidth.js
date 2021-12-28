const itemWidth = 260
const dateWidth = 340

function autoFormWidth(map) {
  return (formItems) => {
    if (!map.get(formItems)) {
      const formItemCount = formItems.length
      const cols = Math.ceil(formItemCount / 8)
      const labelWidths = Array.from({length: cols}).map((_, index) => {
        let maxLabel = 0
        for (let i = index; i < formItemCount; i += cols) {
          const item = formItems[i]
          const curWidth = item.label.length * 18 + 16 + (item.required ? 14 : 0) + (item.tips ? 16 : 0)
          if (curWidth > maxLabel) {
            maxLabel = curWidth
          }
        }
        return maxLabel
      })
      const inputWidths = Array.from({length: cols}).map((_, index) => {
        let maxInput = 0
        for (let i = index; i < formItemCount; i += cols) {
          const item = formItems[i]
          const curWidth = item.dateType === "datetimerange" ? dateWidth : itemWidth
          if (curWidth > maxInput) {
            maxInput = curWidth
          }
        }
        return maxInput
      })
      const labelWidth = {}
      const inputWidth = {}
      formItems.forEach((item, index) => {
        labelWidth[index] = labelWidths[index % cols]
        inputWidth[index] = inputWidths[index % cols]
      })
      map.set(formItems, {
        labelWidth,
        inputWidth,
        dialogWidth: labelWidths.reduce((a, b) => a + b, 0) + inputWidths.reduce((a, b) => a + b, 0) * cols + 40 + (cols - 1) * 10
      })
    }
    return map.get(formItems)
  }
}

module.exports = autoFormWidth