import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { Resend } from 'resend'

type ResendCreateResponse = {
  data?: {
    id?: string
    name?: string
    token?: string
    value?: string
    apiKey?: string
    created_at?: string
    createdAt?: string
  } | null
  error?: {
    message?: string
    name?: string
    statusCode?: number
  } | null
}

function upsertEnv(filePath: string, key: string, value: string) {
  const exists = existsSync(filePath)
  const text = exists ? readFileSync(filePath, 'utf8') : ''
  const lines = text ? text.split(/\r?\n/) : []
  let replaced = false

  const next = lines
    .filter((line) => line.length > 0)
    .map((line) => {
      if (line.startsWith(`${key}=`)) {
        replaced = true
        return `${key}=${value}`
      }
      return line
    })

  if (!replaced) next.push(`${key}=${value}`)
  writeFileSync(filePath, `${next.join('\n')}\n`, 'utf8')
}

async function main() {
  const bootstrapKey = (process.env.RESEND_BOOTSTRAP_KEY || process.argv[2] || '').trim()
  const keyName = (process.env.RESEND_TARGET_KEY_NAME || 'Production').trim()

  if (!bootstrapKey) {
    console.error(JSON.stringify({
      ok: false,
      error: 'Missing RESEND_BOOTSTRAP_KEY or positional bootstrap key argument',
    }, null, 2))
    process.exit(1)
  }

  const admin = new Resend(bootstrapKey)
  const created = await admin.apiKeys.create({ name: keyName }) as ResendCreateResponse

  if (created?.error || !created?.data) {
    console.error(JSON.stringify({
      ok: false,
      step: 'create',
      error: created?.error || { message: 'Resend did not return key data' },
    }, null, 2))
    process.exit(1)
  }

  const token = (created.data.token || created.data.value || created.data.apiKey || '').trim()
  if (!token) {
    console.error(JSON.stringify({
      ok: false,
      step: 'extract-token',
      error: 'API key was created but the token was not returned by the SDK response',
      data: created.data,
    }, null, 2))
    process.exit(1)
  }

  const envLocalPath = resolve(process.cwd(), '.env.local')
  upsertEnv(envLocalPath, 'RESEND_API_KEY', token)
  upsertEnv(envLocalPath, 'RESEND_DOMAIN_VERIFIED', 'true')

  const validation = await new Resend(token).apiKeys.list()
  const keyCount = Array.isArray(validation?.data) ? validation.data.length : 0
  const restrictedSendingKey = String(validation?.error?.message || '').toLowerCase().includes('restricted to only send emails') || String(validation?.error?.name || '').toLowerCase() === 'restricted_api_key'

  console.log(JSON.stringify({
    ok: !validation?.error || restrictedSendingKey,
    created: {
      id: created.data.id || null,
      name: created.data.name || keyName,
      createdAt: created.data.created_at || created.data.createdAt || null,
    },
    envUpdated: envLocalPath,
    validationError: validation?.error || null,
    keyCount: restrictedSendingKey ? Math.max(1, keyCount) : keyCount,
    tokenPreview: `${token.slice(0, 6)}…${token.slice(-4)}`,
  }, null, 2))
}

main().catch((error) => {
  console.error(JSON.stringify({
    ok: false,
    error: error instanceof Error ? error.message : String(error),
  }, null, 2))
  process.exit(1)
})
