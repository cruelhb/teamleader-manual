import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import sectionIds from '../scripts/rehype-section-ids.mjs';

const dist = (path) => new URL(`../dist/${path}`, import.meta.url);

test('홈에 모든 문서가 카드로 나오고 각 문서는 /문서-id/ 주소로 만들어진다', () => {
  const html = readFileSync(dist('index.html'), 'utf8');
  const ids = readdirSync(new URL('../src/content/docs/', import.meta.url))
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.slice(0, -3).toLowerCase());
  assert.ok(ids.length > 0);
  for (const id of ids) {
    assert.ok(html.includes(`href="/${id}/"`), `${id} 카드 없음`);
    assert.ok(existsSync(dist(`${id}/index.html`)), `${id} 페이지 없음`);
  }
});
test('없앤 분류·공지 주소가 남지 않고 예전 주소는 넘겨주기 규칙이 있다', () => {
  for (const old of ['notice', 'guide', 'welfare']) assert.equal(existsSync(dist(old)), false, `${old} 폴더가 남음`);
  const html = readFileSync(dist('index.html'), 'utf8') + readFileSync(dist('search-index.json'), 'utf8');
  assert.doesNotMatch(html, /\/(notice|guide|welfare)\/|공지사항/);
  const redirects = readFileSync(dist('_redirects'), 'utf8');
  for (const old of ['guide', 'welfare']) assert.match(redirects, new RegExp(`^/${old}/\\* /:splat 301$`, 'm'));
});
test('접힌 항목 ID는 요약 힌트와 무관하고 기존 ID·중복 제목과 충돌하지 않는다', () => {
  const summary = (hint) => ({ type:'element', tagName:'summary', properties:{}, children:[
    {type:'text',value:'신청 방법'},
    {type:'element',tagName:'span',properties:{className:['summary-hint']},children:[{type:'text',value:hint}]},
  ]});
  const first=summary('10일'), second=summary('20일');
  const tree={children:[{properties:{id:'section-신청-방법'}},first,second]};
  sectionIds()(tree);
  assert.equal(first.properties.id,'section-신청-방법-2');
  assert.equal(second.properties.id,'section-신청-방법-3');
});
test('빌드한 경조사 HTML에 접힌 항목 링크가 있고 핵심 요약 카드는 없다', () => {
  const html=readFileSync(new URL('../dist/경조사-안내/index.html',import.meta.url),'utf8');
  assert.match(html, /id="section-신청-방법과-기한"/);
  assert.doesNotMatch(html, /quick-summary|핵심 요약/);
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size, ids.length);
});
