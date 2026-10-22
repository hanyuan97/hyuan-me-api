'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

// Fail closed: tests can mutate only the disposable, loopback-only test DB.
const SAFE_URI = 'mongodb://127.0.0.1:27017/hyuan_security_test';

test('actual entrypoint HTTP + MongoDB integration (disposable database only)', { timeout: 60000 }, async t => {
  assert.equal(process.env.DB_URI, SAFE_URI, 'refuse non-test database');
  const port = 3001;
  const child = spawn(process.execPath, ['dist/index.js'], {
    env: { ...process.env, DB_URI: SAFE_URI, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  child.stdout.on('data', b => logs += b);
  child.stderr.on('data', b => logs += b);
  t.after(async () => {
    if (child.exitCode === null) {
      child.kill('SIGTERM');
      await Promise.race([new Promise(r => child.once('exit', r)), delay(3000)]);
      if (child.exitCode === null) child.kill('SIGKILL');
    }
    console.log('entrypoint logs:', logs);
  });
  async function request(path, method = 'GET', body) {
    const r = await fetch(`http://127.0.0.1:${port}${path}`, {
      method, headers: { 'Content-Type': 'application/json', Origin: 'https://example.test' },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(5000),
    });
    const text = await r.text();
    return { status: r.status, headers: r.headers, text, json: () => JSON.parse(text) };
  }
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error('entrypoint exited: ' + logs);
    try { if ((await request('/')).status === 404) { ready = true; break; } } catch {}
    await delay(100);
  }
  assert.ok(ready, logs);
  await t.test('404, HEAD and CORS preserve baseline', async () => {
    const r = await request('/');
    assert.equal(r.status, 404); assert.equal(r.text, '404 Not Found');
    assert.equal(r.headers.get('access-control-allow-origin'), '*');
    assert.equal((await request('/', 'HEAD')).text, '');
    const options = await request('/api/portfolio', 'OPTIONS');
    assert.equal(options.status, 204);
  });
  let category, portfolio;
  await t.test('admin category creation and defaults', async () => {
    const r = await request('/admin/api/category', 'POST', { title: { en: 'Security test', zh_TW: '安全測試' } });
    assert.equal(r.status, 200); category = r.json(); assert.equal(category.order, 0);
    const list = (await request('/admin/api/category?limit=1')).json();
    assert.equal(list.totalCount, 1); assert.equal(list.data[0]._id, category._id);
    const item = await request('/admin/api/category/' + category._id); assert.equal(item.json().title.zh_TW, '安全測試');
  });
  await t.test('portfolio CRUD, localized fields, category population, pagination and sorting', async () => {
    const r = await request('/admin/api/portfolio', 'POST', {
      title: { en: 'Fixture', zh_TW: '測試' }, description: { en: 'Only test DB', zh_TW: '隔離資料庫' },
      categories: [category._id], images: ['fixture.png'], github: 'https://example.test/repo', demo: 'https://example.test/demo', time: '2026',
    });
    assert.equal(r.status, 200); portfolio = r.json(); assert.equal(portfolio.order, 0); assert.equal(portfolio.demo, 'https://example.test/demo');
    const list = (await request('/api/portfolio?page=1&limit=1&sortField=order&sortOrder=desc')).json();
    assert.equal(list.totalCount, 1); assert.equal(list.page, 1); assert.equal(list.limit, 1);
    assert.equal(list.totalPages, 1); assert.equal(list.sortField, 'order'); assert.equal(list.sortOrder, 'desc');
    assert.equal(list.data[0].categories[0].title.zh_TW, '安全測試');
    const defaults = (await request('/admin/api/portfolio')).json(); assert.equal(defaults.limit, 10); assert.equal(defaults.sortOrder, 'asc');
    const item = await request('/api/portfolio/' + portfolio._id); assert.equal(item.json().github, 'https://example.test/repo');
    const updated = await request('/admin/api/portfolio/' + portfolio._id, 'PUT', { order: 3 });
    assert.equal(updated.status, 200); assert.equal(updated.json().order, 3);
    const catUpdated = await request('/admin/api/category/' + category._id, 'PUT', { order: 2 });
    assert.equal(catUpdated.json().order, 2);
  });
  await t.test('missing IDs and invalid IDs retain baseline status/error contracts', async () => {
    for (const base of ['/api/portfolio/', '/admin/api/portfolio/', '/admin/api/category/']) {
      const missing = await request(base + '000000000000000000000000');
      assert.equal(missing.status, 404); assert.deepEqual(missing.json(), { error: 'Item not found' });
      const invalid = await request(base + 'not-an-id');
      assert.equal(invalid.status, 500); assert.deepEqual(invalid.json(), { error: 'Internal server error' });
    }
  });
  await t.test('deletion, missing mutations and empty pagination (test DB only)', async () => {
    assert.equal((await request('/admin/api/portfolio/' + portfolio._id, 'DELETE')).status, 200);
    assert.equal((await request('/admin/api/category/' + category._id, 'DELETE')).status, 200);
    const missing = '/admin/api/portfolio/000000000000000000000000';
    assert.equal((await request(missing, 'PUT', { order: 4 })).status, 404);
    assert.equal((await request(missing, 'DELETE')).status, 404);
    for (const route of ['/admin/api/category', '/admin/api/portfolio']) {
      assert.equal((await request(route, 'DELETE')).json().deletedCount, 0);
    }
    const empty = (await request('/api/portfolio')).json();
    assert.deepEqual(empty.data, []); assert.equal(empty.totalCount, 0); assert.equal(empty.totalPages, 0);
  });
});
