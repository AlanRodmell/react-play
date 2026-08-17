import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders React Bridge with course and reference landmarks", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>React Bridge/);
  assert.match(html, /From Ruby instincts/);
  assert.match(html, /React foundations/);
  assert.match(html, /Production forms/);
  assert.match(html, /Server state/);
  assert.match(html, /Reference/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("ships durable progress and a structured production curriculum", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /react-bridge-progress-v1/);
  assert.match(page, /localStorage\.setItem/);
  assert.match(page, /useSearchParams/);
  assert.match(page, /React Hook Form/);
  assert.match(page, /useMutation/);
  assert.match(page, /React Testing Library/);
  assert.match(page, /Synchronizing with Effects/);
  assert.match(page, /ReactConfOfficial/);
  assert.match(page, /Build the proof, not just the memory/);
  assert.match(page, /Code scratchpad/);
  assert.match(layout, /React Bridge/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview", root)));
});
