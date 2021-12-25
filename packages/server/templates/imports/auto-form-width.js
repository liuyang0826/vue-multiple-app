const itemWidth = 260

const map = new Map()

function autoFormWidth(formItems) {
    if (!map.get(formItems)) {
        map.clear()
        const formItemCount = formItems.length
        const cols = Math.ceil(formItemCount / 8)
        const labelWidths = Array.from({ length: cols }).map((_, index) => {
            let maxLabel = 0
            for (let i = index; i < formItemCount; i += cols) {
                const item = formItems[i]
                const curWidth = item.label.length * 18 + 14 + (item.required ? 12 : 0) + (item.tips ? 16 : 0)
                if (curWidth > maxLabel) {
                    maxLabel = curWidth
                }
            }
            return maxLabel
        })
        const labelWidth = {}
        formItems.forEach((item, index) => {
            labelWidth[index] = labelWidths[index % cols]
        })
        map.set(formItems, {
            labelWidth,
            itemWidth,
            dialogWidth: labelWidths.reduce((a, b) => a + b) + itemWidth * cols + 40 + (cols - 1) * 10
        })
    }
    return map.get(formItems)
}

module.exports = autoFormWidth