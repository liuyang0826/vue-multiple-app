import { injectTemplate } from "../../utils"

const template = `
<<%tag%> :visible.sync="<%visible%>" :data="<%data%>" :title="<%title%>" />
`

type IDialogFormOptions = Record<("tag" | "visible" | "data" | "title"), string>

export default (options: IDialogFormOptions) => injectTemplate(template, options, 2)