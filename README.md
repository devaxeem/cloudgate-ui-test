# Cloudgate U-run test app

A fixture repository for the U-run's live console test (`.project/ui-live-test/` in the Cloudgate
repo). It exists so every build path and the preview flow can be driven against one small repo
whose deploy inputs can be read back off the running container.

| Path | Exercises |
|---|---|
| `server.js`, `package.json` | Nixpacks (Node detection). `GET /` returns JSON with `version`, `greeting` (env `GREETING`), `buildArg` (build-time `BUILD_ARG`) and `target` |
| `Dockerfile` | Dockerfile builds, the `ARG BUILD_ARG` build argument, and the **Docker target** field (stages `runtime` and `debug`) |
| `docker-compose.yml` | Compose from git: two services (`app`, `cache`) and a named volume (`cache-data`) |
| `static/index.html` | The static build type, with publish directory `static` |

`GET /healthz` returns `ok`. The app listens on `PORT` (default 3000).

To show that a preview or redeploy picked up a new commit, bump `VERSION` in `server.js` (and the
string in `static/index.html`) on a branch and open a pull request.
