/**
 * Interactive Payload DB sync — pick local or prod Postgres, then run `cms:sync`.
 *
 * Usage:
 *   pnpm db:sync              # interactive menu
 *   pnpm db:sync -- local     # skip menu
 *   pnpm db:sync -- prod
 */
import 'dotenv/config'

import { spawnSync } from 'node:child_process'

import {
  applyDatabaseUrl,
  confirmProd,
  pickTarget,
  TARGETS,
  type Target,
} from './cli-target'

function run(cmd: string, args: string[], env: NodeJS.ProcessEnv): number {
  const result = spawnSync(cmd, args, {
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  return result.status ?? 1
}

async function main() {
  const argv = process.argv.slice(2).filter((a) => a !== '--')
  const target = await pickTarget(argv, 'Payload DB sync')
  applyDatabaseUrl(target)

  const ok = await confirmProd(target, 'Sync schema')
  if (!ok) {
    console.log('Cancelled.')
    process.exit(0)
  }

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PAYLOAD_DISABLE_DB_PUSH: 'false',
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--no-deprecation', '--dns-result-order=ipv4first']
      .filter(Boolean)
      .join(' '),
  }

  console.log(`\n[db:sync] Target: ${TARGETS[target as Target].label}\n`)

  const steps: Array<{ name: string; args: string[] }> = [
    { name: 'pnpm', args: ['run', 'generate:importmap'] },
    { name: 'pnpm', args: ['run', 'generate:types'] },
    { name: 'pnpm', args: ['run', 'payload:db-sync'] },
  ]

  for (const step of steps) {
    console.log(`\n[db:sync] → ${step.args.join(' ')}\n`)
    const code = run(step.name, step.args, env)
    if (code !== 0) {
      console.error(`\n[db:sync] Failed (${step.args.join(' ')})`)
      process.exit(code)
    }
  }

  console.log('\n[db:sync] Done.\n')
  if (target === 'prod') {
    console.log('  Next: pnpm seed -- prod all\n')
  }
}

main().catch((err) => {
  console.error('[db:sync] Error:', err)
  process.exit(1)
})
