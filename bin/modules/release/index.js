import open from 'open'
import packageJSON from '../../../package.json' assert { type: 'json' }
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { valid, ltr, eq } from 'semver'
import { execSync } from 'child_process'
import { createInterface } from 'readline'

export const COLORS = {
  RED: '\x1b[31m',
  RESET: '\x1b[0m',
  GRAY: '\x1b[90m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  GREEN: '\x1b[32m',
  WHITE: '\x1b[37m',
  YELLOW: '\x1b[33m',
  MAGENTA: '\x1b[35m',
  LIGHT_GRAY: '\x1b[37m',
  SOFT_GRAY: '\x1b[38;5;244m',
}

export function extractOwnerAndRepoFromGitRemoteURL(url) {
  return url
    ?.replace(/^git@github.com:|.git$/gims, '')
    ?.replace(/^https:\/\/github.com\/|.git$/gims, '')
    ?.trim()
}

export function question(question) {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close()
      resolve(answer)
    })
  })
}

function makeOptions(options) {
  return {
    stdio: options?.inherit ? 'inherit' : 'pipe',
    cwd: resolve(),
    encoding: 'utf8',
  }
}

export function exec(commands, options) {
  const outputs = []

  for (const command of commands) {
    const output = execSync(command, makeOptions(options))
    outputs.push(output)
  }

  return outputs
}

export function checkValidations({ version, newVersion }) {
  if (!newVersion) {
    console.log(`${COLORS.RED}No version entered${COLORS.RESET}`)

    return true
  }

  if (!valid(newVersion)) {
    console.log(
      `${COLORS.RED}Version must have a semver format (${COLORS.SOFT_GRAY}x.x.x${COLORS.RESET} example: ${COLORS.GREEN}1.0.1${COLORS.RESET}${COLORS.RED})${COLORS.RESET}`
    )

    return true
  }

  if (ltr(newVersion, version)) {
    console.log(
      `${COLORS.RED}New version is lower than current version${COLORS.RESET}`
    )

    return true
  }

  if (eq(newVersion, version)) {
    console.log(
      `${COLORS.RED}New version is equal to current version${COLORS.RESET}`
    )

    return true
  }
}

async function makeRelease() {
  console.clear()

  const { version } = packageJSON

  const newVersion = await question(
    `Enter a new version: ${COLORS.SOFT_GRAY}(current is ${version})${COLORS.RESET} `
  )

  if (checkValidations({ version, newVersion })) {
    return
  }

  try {
    console.log(
      `${COLORS.CYAN}> Updating package.json version...${COLORS.RESET}`
    )

    await writeFile(
      resolve('package.json'),
      JSON.stringify(packageJSON, null, 2)
    )

    console.log(`\n${COLORS.GREEN}Done!${COLORS.RESET}\n`)
    console.log(`${COLORS.CYAN}> Trying to release it...${COLORS.RESET}`)

    exec(
      [
        `git commit -am v${newVersion}`,
        `git tag v${newVersion}`,
        `git push`,
        `git push --tags`,
      ],
      {
        inherit: true,
      }
    )

    const [repository] = exec([`git remote get-url --push origin`])
    const ownerAndRepo = extractOwnerAndRepoFromGitRemoteURL(repository)

    console.log(
      `${COLORS.CYAN}> Opening the repository releases page...${COLORS.RESET}`
    )

    await open(`https://github.com/${ownerAndRepo}/releases`)

    console.log(
      `${COLORS.CYAN}> Opening the repository actions page...${COLORS.RESET}`
    )

    await open(`https://github.com/${ownerAndRepo}/actions`)

    console.log(`\n${COLORS.GREEN}Done!${COLORS.RESET}\n`)
  } catch ({ message }) {
    console.log(`
    🛑 Something went wrong!\n
      👀 Error: ${message}
    `)
  }
}

makeRelease()
