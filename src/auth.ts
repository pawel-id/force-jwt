import { AuthInfo, AuthRemover, Connection } from '@salesforce/core'

/**
 * Returns `AuthInfo` for existing alias. Note that the parameter is username,
 * not alias.
 *
 * @param username username
 */
export async function getAuthInfoForAlias(username: string) {
  return await AuthInfo.create({ username })
}



/**
 * Returns `AuthInfo` for JWT login. 
 * 
 * see salesforce cli implementation for reference:
 * https://github.com/salesforcecli/plugin-auth/blob/main/src/commands/org/login/jwt.ts
 * 
 * @param username 
 * @param clientId 
 * @param privateKeyFile 
 */
export async function getAuthInfoForJwt(
  username: string,
  clientId: string,
  privateKeyFile: string
) {
  const authInfoOptions: AuthInfo.Options = {
    username,
    oauth2Options: {
      clientId,
      privateKeyFile,
      // note: this loginUrl works only for non-production orgs
      loginUrl: 'https://test.salesforce.com',
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

export async function getConnection(authInfo: AuthInfo) {
  return await Connection.create({ authInfo })
}

const [username, serverKey, clientId] = process.argv.slice(2)

const authInfoForJwt = await getAuthInfoForJwt(username, clientId, serverKey)
const conn = await getConnection(authInfoForJwt)
console.log(conn.getUsername())
console.log(conn.instanceUrl)
