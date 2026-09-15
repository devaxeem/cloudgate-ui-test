// A tiny HTTP server for the U-run's git-provider and preview phases (U10).
// It prints one runtime env var, one build arg (baked into build-info.json at
// build time) and a version string, so a deploy's inputs can be read back off
// the running container with one request.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const VERSION = '2.0.0-preview2';
const port = Number(process.env.PORT || 3000);

function buildInfo() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'build-info.json'), 'utf8'));
  } catch {
    return { buildArg: null };
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('ok\n');
    return;
  }
  if (req.url === '/' || req.url === '/info') {
    const body = {
      app: 'cloudgate-ui-run-test-app',
      version: VERSION,
      greeting: process.env.GREETING ?? null,
      buildArg: buildInfo().buildArg,
      target: process.env.BUILD_TARGET ?? null,
      hostname: require('node:os').hostname(),
    };
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body, null, 2) + '\n');
    return;
  }
  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('not found\n');
});

server.listen(port, () => {
  console.log(`test-app ${VERSION} listening on :${port}`);
});
