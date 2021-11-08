import { configurator } from "./templates/normal-table"
import writeFile from "./write-file";

async function main() {
    const result = await configurator()
    writeFile(result)
}

main()

