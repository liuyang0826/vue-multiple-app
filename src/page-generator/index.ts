import { configurator } from "./templates/table"
import writeFile from "./write-file";

async function main() {
    const result = await configurator()
    writeFile(result)
}

main()

