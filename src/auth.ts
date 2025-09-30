import { AuthInfo, AuthRemover, Connection } from '@salesforce/core'

/**
 * Returns `AuthInfo` for existing alias. Note that the parameter is username,
 * not alias.
 *
 * @param username username
 */
export async function getAuthInfoForAlias(username: string): Promise<AuthInfo> {
  return await AuthInfo.create({ username })
}

/**
 * Configuration options for JWT authentication
 */
export interface JwtAuthOptions {
  username: string
  clientId: string
  privateKeyFile: string
  loginUrl?: string
}

/**
 * Returns `AuthInfo` for JWT login. 
 * 
 * see salesforce cli implementation for reference:
 * https://github.com/salesforcecli/plugin-auth/blob/main/src/commands/org/login/jwt.ts
 * 
 * @param options JWT authentication options
 * @param options.username Salesforce username
 * @param options.clientId Connected App consumer key
 * @param options.privateKeyFile Path to the private key file
 * @param options.loginUrl Salesforce login URL (defaults to production)
 * @returns Promise resolving to AuthInfo instance
 */
export async function getAuthInfoForJwt(options: JwtAuthOptions): Promise<AuthInfo> {
  const { username, clientId, privateKeyFile, loginUrl = 'https://login.salesforce.com' } = options

  // Validate required parameters
  if (!username) {
    throw new Error('Username is required')
  }
  if (!clientId) {
    throw new Error('Client ID is required')
  }
  if (!privateKeyFile) {
    throw new Error('Private key file path is required')
  }

  const authInfoOptions: AuthInfo.Options = {
    username,
    oauth2Options: {
      clientId,
      privateKeyFile,
      loginUrl,
    },
  }

  let authInfo: AuthInfo
  try {
    authInfo = await AuthInfo.create(authInfoOptions)
  } catch (error) {
    const err = error as Error
    if (err.name === 'AuthInfoOverwriteError') {
      console.log('Auth file already exists. Removing and starting fresh.')
      const remover = await AuthRemover.create()
      await remover.removeAuth(username)
      authInfo = await AuthInfo.create(authInfoOptions)
    } else {
      throw err
    }
  }

  return authInfo
}

/**
 * Creates a Salesforce connection from AuthInfo
 * 
 * @param authInfo AuthInfo instance
 * @returns Promise resolving to Connection instance
 */
export async function getConnection(authInfo: AuthInfo): Promise<Connection> {
  return await Connection.create({ authInfo })
}


