import { writeFile,readFile } from 'fs/promises'
import { normalize, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getDevFolder = (path) => {
  const [nodeModules, devFolder] = normalize(dirname(path)).split(/\/|\\/g)

  return [nodeModules, devFolder].join('/')
}

async function createPackageJSONDistVersion() {
  const packageJSONPath = resolve(__dirname, '../../../package.json')
  const packageJSONText = await readFile(packageJSONPath, 'utf8')
  const packageJSON = JSON.parse(packageJSONText)

  const { main, scripts, resources, devDependencies, ...rest } = packageJSON

  const packageJSONDistVersion = {
    main: './main/index.js',
    ...rest,
  }

  try {
    await writeFile(
      resolve(getDevFolder(main), 'package.json'),
      JSON.stringify(packageJSONDistVersion, null, 2)
    )
  } catch ({ message }) {
    console.log(`
    🛑 Something went wrong!\n
      🧐 There was a problem creating the package.json dist version...\n
      👀 Error: ${message}
    `)
  }
}

createPackageJSONDistVersion()
