# Node security update preparation

- Runtime/build: Node 24.22.1, digest-pinned official alpine image; `.nvmrc` and `engines.node` agree.
- Package manager: pin pnpm 8.4.0, the version recorded in the deployed `.modules.yaml`. This is not an application dependency upgrade.
- `pnpm-lock.yaml` is recovered verbatim from the deployed `/app/node_modules/.pnpm/lock.yaml` (lock format 6). Install uses `--frozen-lockfile`; no re-resolution or dependency updates are intended.
- Existing TypeScript 4.9.5 and `@types/node` 18.14.6 are retained deliberately: the type package describes the API surface this existing application uses, not the runtime security version. Full build and real Node 24 integration checks passed without a compatibility upgrade.
- GitHub baseline `fb4dbde` omitted the deployed optional portfolio `demo` string field. Its source declaration/schema is restored to preserve production behavior; this is not a new feature.
- The legacy EXPOSE 3000 metadata is unchanged. The actual default listener is **3001**, unless `PORT` is supplied.

## Tests

`pnpm build` compiles the unchanged application behavior. `pnpm test` runs a bounded real-entrypoint HTTP/Mongoose integration suite, but is intentionally gated on the exact disposable URI:

```
DB_URI=mongodb://127.0.0.1:27017/hyuan_security_test pnpm test
```

**Run only in an isolated namespace with a disposable MongoDB, never against production.** The verified harness uses MongoDB 6.0.8 in Docker `NetworkMode=none`, with ephemeral tmpfs DB directories and no published ports. The API test container shares only that namespace and has no mounts or production credentials. Tests create/update/delete fixture records in that ephemeral DB, covering CORS, 404/HEAD/OPTIONS, CRUD, populated categories, localized fields, deployed demo-field preservation, pagination/defaults/sorting, and missing/invalid ID error contracts. The test runner spawns `node dist/index.js` and terminates it afterwards.

The candidate image intentionally retains the existing deploy contents (compiled app and full node_modules); the harness copies tests/package.json into its disposable test container, not into the production image. No production write requests are needed.

## Deployment prerequisites

Review exact source/artifact diff and test receipt first. Preserve the current production DB_URI, timezone, br0 static IP 192.168.1.26, networks, restart policy and startup command; do not expose credentials in the review. Capture the old image/container configuration for rollback. Deployment is a separate authorized action after Vaultwarden is complete. Existing legacy application/dependency security debt and unauthenticated admin routes are not fixed by this runtime-only update. No authentication, validation, dependency upgrade or DB migration is included.
