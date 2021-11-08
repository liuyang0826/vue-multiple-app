import { configurator } from "./templates/tabs"
import writeFile from "./write-file";

async function main() {
    const result = await configurator()
    writeFile(result)
}

main()

