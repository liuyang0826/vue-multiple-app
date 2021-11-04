const { injectTemplate } = require("../../utils")

const template = `
<<%tag%> :visible.sync="<%visible%>" :data="<%data%>" :title="<%title%>" />
`

module.exports = ({visible, title, tag, data}) => injectTemplate(template, {
    visible, title, tag, data
}, 2)