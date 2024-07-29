import { writeFile } from 'fs/promises'
import packageJSON from '../../../package.json' assert { type: 'json' }
const { normalize, dirname,resolve } = require('path')

const getDevFolder = (path) => {
  const [nodeModules, devFolder] = normalize(dirname(path)).split(/\/|\\/g)

  return [nodeModules, devFolder].join('/')
}

async function createPackageJSONDistVersion() {
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
