# API Gateway migration: remove Firebase authentication

The game API no longer uses a Lambda authorizer. Every request now identifies the
device with these headers:

- `X-Player-Id`: stable random device ID (8-64 letters, numbers, or hyphens)
- `X-Player-Name`: URL-encoded display name (1-16 characters)

This identity is intentionally unauthenticated and must not be treated as a
security boundary.

## Deploy the updated game Lambda

1. Run `npm run build` in `intruders-server`.
2. Package and deploy `out/gameLambda.js` to the existing game Lambda using the
   same handler and DynamoDB environment variables (`TABLE_NAME` and `REGION`).
3. Set the Lambda runtime to **Node.js 24.x**.
4. Do not deploy an `authLambda` artifact; it is no longer built.

## Update the HTTP API in API Gateway

1. Open **API Gateway**, select the existing HTTP API, then open **Routes**.
2. For every route integrated with the game Lambda, change **Authorization** to
   `NONE`. Remove the Lambda authorizer from `$default` too if it is configured
   there.
3. Open **CORS** and add these allowed headers:
   - `Content-Type`
   - `X-Player-Id`
   - `X-Player-Name`
4. Keep the methods used by the app allowed: `GET`, `POST`, `PUT`, and `DELETE`.
5. Save and deploy the API stage if automatic deployment is disabled.
6. After all routes are detached, delete the API Gateway Lambda authorizer.

## Remove obsolete AWS configuration

1. Delete the old authentication Lambda only after confirming no API routes
   reference it.
2. Remove its `PRIVATE_KEY` and `PLAYERS_SECRET_TOKENS` environment variables.
3. Remove any invoke permission whose only purpose was allowing API Gateway to
   call the authentication Lambda.
4. Remove the Firebase Admin service account from Firebase/Google Cloud if
   nothing else uses it.

## Smoke test

Replace the URL below with the API invoke URL:

```sh
curl -i "https://YOUR_API_ID.execute-api.us-east-2.amazonaws.com/find-game" \
  -H "X-Player-Id: smoke-player-1" \
  -H "X-Player-Name: Smoke%20Player"
```

A successful response is HTTP 200. A request without the two player headers
should return HTTP 400.

For a no-downtime rollout, make these changes on a temporary API stage first,
deploy the new frontend against that stage, test it, and then promote the stage.
