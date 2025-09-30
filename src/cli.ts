#!/usr/bin/env node

import { getAuthInfoForJwt, getConnection } from './auth.js'

/**
 * CLI script for JWT authentication with Salesforce
 * Usage: npx tsx src/cli.ts <username> <privateKeyFile> <clientId> [loginUrl]
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.length < 3) {
    console.error('Error: Missing required arguments')
    console.error('Usage: npx tsx src/cli.ts <username> <privateKeyFile> <clientId> [loginUrl]')
    console.error('')
    console.error('Arguments:')
    console.error('  username        Salesforce username')
    console.error('  privateKeyFile  Path to private key file')
    console.error('  clientId        Connected App consumer key')
    console.error('  loginUrl        (Optional) Salesforce login URL')
    console.error('                  - https://login.salesforce.com (production, default)')
    console.error('                  - https://test.salesforce.com (sandbox)')
    process.exit(1)
  }

  const [username, privateKeyFile, clientId, loginUrl] = args

  try {
    console.log('Authenticating with JWT...')
    console.log(`Username: ${username}`)
    console.log(`Private Key File: ${privateKeyFile}`)
    console.log(`Client ID: ${clientId}`)
    console.log(`Login URL: ${loginUrl ?? 'https://login.salesforce.com (default)'}`)
    console.log('')

    const authInfo = await getAuthInfoForJwt({
      username,
      clientId,
      privateKeyFile,
      loginUrl,
    })

    console.log('Creating connection...')
    const conn = await getConnection(authInfo)

    console.log('✅ Authentication successful!')
    console.log(`Username: ${conn.getUsername()}`)
    console.log(`Instance URL: ${conn.instanceUrl}`)
  } catch (error) {
    console.error('❌ Authentication failed:')
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(String(error))
    }
    process.exit(1)
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
