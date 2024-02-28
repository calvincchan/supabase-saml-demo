# About

Author: Calvin C. Chan at https://calvincchan.com

Run a simple local instance of Supabase and test SAML Sign Sign-on with a minimal React app.

# Getting Started

## Starting Supabase Instance

1. copy `example.env` to `.env`. The `.env` file aleady contains a working SAML private key. If you want to change it, you can use the `./scripts/genkey.sh` to generate a new key that is already base64 encoded and copy it to `GOTRUE_SAML_PRIVATE_KEY` of the `.env` file.

2. `docker compose up -d`

3. Add the SAML Identity Provider metadata to the Supabase instance.

```bash
API_KEY=(your supabase service role key);
curl -X POST http://localhost:8000/auth/v1/admin/sso/providers \
-H 'APIKey: '"$API_KEY"'' \
-H 'Authorization: Bearer '"$API_KEY"'' \
-H 'Content-Type: application/json' \
-d '{
    "type": "saml",
    "metadata_url": "(paste the SAML Metadata URL here)",
    "domains": ["auth0.com"]
    "attribute_mapping": {
      "keys": {
        "email": { "name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress" },
        "given_name": { "name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname" },
        "name": { "name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name" },
        "family_name": { "name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname" },
        "name_id": { "name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier" }
      }
    }
}';
```

for more options please see my blog posts:

- https://calvincchan.com/blog/self-hosted-supabase-enable-sso
- https://calvincchan.com/blog/240228_self_hosted_supabase_with_saml_attribute_mapping

## Starting The React Client

1. cd `client`

2. `yarn install`

3. `yarn dev`

Note: if you changed the `JWT_SECRET`, `ANON_KEY` or `SERVICE_ROLE_KEY`, please also update the value of `SUPABASE_KEY` in `src/supabase-client.ts`.
