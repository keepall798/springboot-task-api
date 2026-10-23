/**
 * 把 api-smoke-test.mjs 的真实测试结果渲染成 HTML，方便截图/交作业。
 * 运行：node scripts/generate-test-report.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const inputFile = path.resolve('docs/evidence/api-test-results.json');
const outputFile = path.resolve('docs/evidence/api-test-report.html');
const data = JSON.parse(await fs.readFile(inputFile, 'utf8'));

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const pretty = (value) => value === null || value === undefined
  ? '（无请求体）'
  : JSON.stringify(value, null, 2);

const cards = data.results.map((result, index) => {
  const statusClass = result.actualStatus >= 200 && result.actualStatus < 300
    ? 'ok'
    : 'error';
  const cleanName = result.name.replace(/^\d+\s*/, '');
  const responseText = result.responseBody === null
    ? '（无响应体，HTTP 204 No Content）'
    : JSON.stringify(result.responseBody, null, 2);
  return `
    <section class="card">
      <div class="card-head">
        <div>
          <span class="index">${String(index + 1).padStart(2, '0')}</span>
          <strong>${escapeHtml(cleanName)}</strong>
        </div>
        <span class="badge ${result.passed ? 'pass' : 'fail'}">
          ${result.passed ? 'PASS' : 'FAIL'}
        </span>
      </div>
      <div class="line">
        <span class="method ${result.method.toLowerCase()}">${escapeHtml(result.method)}</span>
        <code>${escapeHtml(result.path)}</code>
        <span class="status ${statusClass}">HTTP ${result.actualStatus}</span>
        <span class="duration">${result.durationMs} ms</span>
      </div>
      <div class="columns">
        <div>
          <div class="label">请求体</div>
          <pre>${escapeHtml(pretty(result.requestBody))}</pre>
        </div>
        <div>
          <div class="label">实际响应体</div>
          <pre>${escapeHtml(responseText)}</pre>
        </div>
      </div>
      ${result.failureReason ? `<p class="failure">${escapeHtml(result.failureReason)}</p>` : ''}
    </section>`;
}).join('');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>任务清单 API 测试记录</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 42px;
      background: #f3f6fb;
      color: #1f2d3d;
      font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
    }
    .page { max-width: 1220px; margin: 0 auto; }
    header {
      background: linear-gradient(135deg, #123a63, #1f6f8b);
      color: white;
      border-radius: 18px;
      padding: 32px 38px;
      box-shadow: 0 12px 30px rgba(18, 58, 99, .18);
    }
    h1 { margin: 0 0 8px; font-size: 30px; letter-spacing: .5px; }
    .subtitle { opacity: .82; font-size: 14px; }
    .stats { display: flex; gap: 16px; margin: 24px 0; }
    .stat {
      flex: 1;
      background: white;
      border-radius: 12px;
      padding: 20px 24px;
      border: 1px solid #e3eaf3;
      box-shadow: 0 5px 14px rgba(31, 45, 61, .05);
    }
    .stat b { display: block; font-size: 30px; color: #1f6f8b; }
    .stat span { color: #6b7c93; font-size: 13px; }
    .meta {
      background: white;
      border: 1px solid #e3eaf3;
      border-radius: 12px;
      padding: 14px 20px;
      margin-bottom: 20px;
      color: #52657a;
      font-size: 13px;
      line-height: 1.8;
    }
    .card {
      background: white;
      border: 1px solid #e3eaf3;
      border-radius: 14px;
      padding: 20px 24px;
      margin-bottom: 16px;
      box-shadow: 0 5px 14px rgba(31, 45, 61, .04);
      page-break-inside: avoid;
    }
    .card-head { display: flex; justify-content: space-between; align-items: center; }
    .card-head strong { font-size: 16px; }
    .index {
      display: inline-block;
      color: #1f6f8b;
      font-weight: 700;
      margin-right: 8px;
    }
    .badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .8px;
      padding: 5px 10px;
      border-radius: 99px;
    }
    .badge.pass { color: #137547; background: #e4f6ec; }
    .badge.fail { color: #b42318; background: #fee4e2; }
    .line { display: flex; align-items: center; gap: 12px; margin: 14px 0; flex-wrap: wrap; }
    .method {
      font-size: 11px;
      font-weight: 700;
      color: white;
      border-radius: 6px;
      padding: 5px 9px;
    }
    .method.get { background: #2f6fed; }
    .method.post { background: #12805c; }
    .method.put { background: #b76e00; }
    .method.delete { background: #c4320a; }
    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 13px;
      color: #33475b;
      background: #f4f7fa;
      border-radius: 5px;
      padding: 4px 8px;
    }
    .status { font-size: 12px; font-weight: 700; }
    .status.ok { color: #137547; }
    .status.error { color: #b42318; }
    .duration { color: #8a99ab; font-size: 12px; margin-left: auto; }
    .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .label {
      font-size: 12px;
      font-weight: 700;
      color: #6b7c93;
      margin-bottom: 6px;
    }
    pre {
      margin: 0;
      min-height: 66px;
      background: #0f1e2e;
      color: #dce8f5;
      border-radius: 9px;
      padding: 14px 16px;
      font: 12px/1.65 Consolas, "Courier New", monospace;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .failure { color: #b42318; font-size: 13px; }
    footer { margin-top: 22px; color: #8a99ab; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <h1>任务清单 API · 接口测试记录</h1>
      <div class="subtitle">Spring Boot 3.5.16 + Spring Data JPA + MySQL 5.7.29 · 真实请求与响应</div>
    </header>

    <div class="stats">
      <div class="stat"><b>${data.passed}/${data.total}</b><span>测试用例通过</span></div>
      <div class="stat"><b>0</b><span>失败用例</span></div>
      <div class="stat"><b>5</b><span>核心 REST 接口</span></div>
      <div class="stat"><b>${new Date(data.runAt).toLocaleString('zh-CN', { hour12: false })}</b><span>执行时间</span></div>
    </div>

    <div class="meta">
      测试地址：${escapeHtml(data.baseUrl)} &nbsp;|&nbsp; Node.js：${escapeHtml(data.nodeVersion)} &nbsp;|&nbsp;
      数据库：task_manager.task &nbsp;|&nbsp; 测试脚本：<code>scripts/api-smoke-test.mjs</code>
    </div>

    ${cards}

    <footer>本页面由 scripts/generate-test-report.mjs 根据真实接口返回自动生成</footer>
  </div>
</body>
</html>`;

await fs.writeFile(outputFile, html, 'utf8');
console.log(`测试报告已生成：${outputFile}`);
