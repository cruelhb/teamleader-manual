import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import sectionIds from '../scripts/rehype-section-ids.mjs';

const dist = (path) => new URL(`../dist/${path}`, import.meta.url);

test('홈에 업무 매뉴얼·기준 및 규정의 모든 문서가 카드로 나온다', () => {
  const html = readFileSync(dist('index.html'), 'utf8');
  for (const category of ['guide', 'welfare']) {
    const ids = readdirSync(new URL(`../src/content/${category}/`, import.meta.url))
      .filter((name) => name.endsWith('.md'))
      .map((name) => name.slice(0, -3).toLowerCase());
    assert.ok(ids.length > 0);
    for (const id of ids) assert.ok(html.includes(`href="/${category}/${id}/"`), `${category}/${id} 카드 없음`);
  }
});
test('공지사항 메뉴와 페이지가 남아 있지 않다', () => {
  assert.equal(existsSync(dist('notice')), false);
  const html = readFileSync(dist('index.html'), 'utf8') + readFileSync(dist('search-index.json'), 'utf8');
  assert.doesNotMatch(html, /\/notice\/|공지사항/);
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
test('빌드한 경조사 HTML에 접힌 항목 링크와 요약이 포함된다', () => {
  const html=readFileSync(new URL('../dist/welfare/경조사-안내/index.html',import.meta.url),'utf8');
  assert.match(html, /id="section-신청-방법과-기한"/);
  assert.match(html, /핵심 요약/);
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size, ids.length);
});
