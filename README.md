# Salesforce JWT Authorization

Salesforce provides a way to authorize users by using cryptographic keys. A
single key may be used for multiple users. This is achieved by creating a
Connected App in Salesforce. The Connected App has an associated certificate
provided during configuration. Then, having a key related to the certificate, we
can authorize any user allowed to do so by the Connected App (via Profile or
Permission Set).

## Connected App configuration

Before starting configuration, ensure that the Salesforce user who will be
performing the Connected App configuration has a valid and accessible email
address. This is crucial because Salesforce may send confirmation emails during
the Connected App creation process.

Follow this instruction to create a Connected App:
[Authorize an Org Using the JWT Flow](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_jwt_flow.htm)

## Authorization

Having completed Connected App create the following environment variables
(required only for testing convenience):

- USERNAME: target Username to be authorized
- CLIENT_ID: Connected App consumer key
- SERVER_KEY: path to the private key file (e.g. server.key)

### Authorize using CLI

Use
[sf org login jwt](https://developer.salesforce.com/docs/atlas.en-us.256.0.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_org_commands_unified.htm#cli_reference_org_login_jwt_unified)
command to authorize a user using the JWT Bearer Flow.

```bash
sf org login jwt --username "$USERNAME" --jwt-key-file "$SERVER_KEY" --client-id "$CLIENT_ID"
```

### Authorize using API

Here is a simple example of how to authorize a user using the JWT Bearer Flow
using the API. The example uses the [@salesforce/core](https://www.npmjs.com/package/@salesforce/core) package to interact with the Salesforce API.

Reference:

- https://github.com/salesforcecli/plugin-auth/blob/main/src/commands/org/login/jwt.ts
- https://forcedotcom.github.io/sfdx-core/

```bash
# Install dependencies (including @salesforce/core)
npm install

# Run the script
npx tsx src/auth.ts "$USERNAME" "$SERVER_KEY" "$CLIENT_ID"
```

See source code [src/auth.ts](src/auth.ts).

## Further reading

[OAuth 2.0 JWT Bearer Flow for Server-to-Server Integration](https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_oauth_jwt_flow.htm&type=5)
