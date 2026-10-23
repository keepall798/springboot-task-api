/**
 * 接口冒烟测试（不需要安装 Postman 就能跑）。
 *
 * 运行方式（项目根目录，确保后端已启动）：
 *   node scripts/api-smoke-test.mjs
 *
 * 测试内容：
 *   1. 新增任务（201）
 *   2. 查询全部（200）
 *   3. 查询单个（200）
 *   4. 更新任务（200）
 *   5. 删除任务（204）
 *   6. 删除后再查（404）
 *   7. 参数校验 / 非法状态（400）
 *
 * 结果会写入 docs/evidence/api-test-results.json，方便作为学习记录。
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080';
const OUTPUT_DIR = path.resolve('docs/evidence');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'api-test-results.json');

const results = [];
let failed = 0;

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(method, apiPath, body) {
  const startedAt = Date.now();
  const response = await fetch(BASE_URL + apiPath, {
    method,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json; charset=UTF-8' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const rawBody = await response.text();
  let parsedBody = null;
  if (rawBody) {
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      parsedBody = rawBody;
    }
  }

  return {
    status: response.status,
    headers: Object.fromEntries(
      [...response.headers.entries()].filter(([key]) =>
        ['content-type', 'location'].includes(key)
      )
    ),
    body: parsedBody,
    rawBody,
    durationMs: Date.now() - startedAt
  };
}

async function runTest(name, method, apiPath, requestBody, expectedStatus, verify) {
  const response = await request(method, apiPath, requestBody);
  try {
    expect(
      response.status === expectedStatus,
      `期望 HTTP ${expectedStatus}，实际 ${response.status}`
    );
    if (verify) {
      verify(response);
    }
    results.push({
      name,
      method,
      path: apiPath,
      requestBody: requestBody ?? null,
      expectedStatus,
      actualStatus: response.status,
      responseHeaders: response.headers,
      responseBody: response.body,
      durationMs: response.durationMs,
      passed: true
    });
    console.log(`  ✅ ${name}  [HTTP ${response.status}]`);
  } catch (error) {
    failed += 1;
    results.push({
      name,
      method,
      path: apiPath,
      requestBody: requestBody ?? null,
      expectedStatus,
      actualStatus: response.status,
      responseHeaders: response.headers,
      responseBody: response.body,
      durationMs: response.durationMs,
      passed: false,
      failureReason: error.message
    });
    console.log(`  ❌ ${name}  [HTTP ${response.status}] ${error.message}`);
  }
  return response;
}

async function main() {
  console.log(`\n开始测试：${BASE_URL}\n`);
  const runTag = Date.now().toString().slice(-6);
  const titleA = `学习 Spring Boot 增删改查-${runTag}`;
  const titleB = `整理接口测试记录-${runTag}`;

  const createdA = await runTest(
    '01 新增任务 A（默认状态 TODO）',
    'POST',
    '/api/tasks',
    { title: titleA },
    201,
    (response) => {
      expect(typeof response.body.id === 'number', '响应中应有数字 id');
      expect(response.body.title === titleA, '标题应与提交内容一致');
      expect(response.body.status === 'TODO', '不传状态时应默认为 TODO');
      expect(
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(response.body.createdAt),
        'createdAt 格式应为 yyyy-MM-dd HH:mm:ss'
      );
      expect(Boolean(response.headers.location), '应返回 Location 响应头');
    }
  );
  const idA = createdA.body?.id;

  const createdB = await runTest(
    '02 新增任务 B（指定状态 IN_PROGRESS）',
    'POST',
    '/api/tasks',
    { title: titleB, status: 'IN_PROGRESS' },
    201,
    (response) => {
      expect(response.body.status === 'IN_PROGRESS', '状态应为 IN_PROGRESS');
    }
  );
  const idB = createdB.body?.id;

  await runTest(
    '03 查询全部任务',
    'GET',
    '/api/tasks',
    undefined,
    200,
    (response) => {
      expect(Array.isArray(response.body), '应返回 JSON 数组');
      const ids = response.body.map((task) => task.id);
      expect(ids.includes(idA), '列表中应包含任务 A');
      expect(ids.includes(idB), '列表中应包含任务 B');
    }
  );

  await runTest(
    '04 按 id 查询单个任务',
    'GET',
    `/api/tasks/${idA}`,
    undefined,
    200,
    (response) => {
      expect(response.body.id === idA, '返回的 id 应正确');
      expect(response.body.title === titleA, '返回的标题应正确');
    }
  );

  await runTest(
    '05 更新任务（标题 + 状态改为 DONE）',
    'PUT',
    `/api/tasks/${idA}`,
    { title: `${titleA}（已更新）`, status: 'DONE' },
    200,
    (response) => {
      expect(response.body.status === 'DONE', '更新后状态应为 DONE');
      expect(response.body.title.endsWith('（已更新）'), '更新后标题应改变');
    }
  );

  await runTest(
    '06 删除任务',
    'DELETE',
    `/api/tasks/${idA}`,
    undefined,
    204
  );

  await runTest(
    '07 查询已删除的任务（应 404）',
    'GET',
    `/api/tasks/${idA}`,
    undefined,
    404,
    (response) => {
      expect(response.body.status === 404, '错误响应中的 status 应为 404');
      expect(response.body.message.includes('任务不存在'), '应返回中文错误信息');
    }
  );

  await runTest(
    '08 参数校验：空标题应 400',
    'POST',
    '/api/tasks',
    { title: '' },
    400,
    (response) => {
      expect(response.body.fieldErrors?.title, '应返回 title 字段错误');
    }
  );

  await runTest(
    '09 非法状态应 400',
    'POST',
    '/api/tasks',
    { title: '非法状态测试', status: 'UNKNOWN' },
    400
  );

  // 清理任务 B，避免每次测试都在数据库里留下数据
  if (idB) {
    await request('DELETE', `/api/tasks/${idB}`);
  }

  const summary = {
    baseUrl: BASE_URL,
    runAt: new Date().toISOString(),
    nodeVersion: process.version,
    total: results.length,
    passed: results.filter((item) => item.passed).length,
    failed,
    results
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`\n测试完成：${summary.passed}/${summary.total} 通过，${failed} 失败`);
  console.log(`详细结果：${OUTPUT_FILE}\n`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('\n测试执行失败：', error);
  process.exitCode = 1;
});
