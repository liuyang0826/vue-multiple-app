const itemWidth = 260

function autoFormWidth(formItems) {
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

    formItems.forEach((item, index) => {
        item.labelWidth = labelWidths[index % cols]
        item.itemWidth = itemWidth
    })

    return labelWidths.reduce((a, b) => a + b) + itemWidth * cols + 40 + (cols - 1) * 10
}

module.exports = autoFormWidth