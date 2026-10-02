import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { noticeState } from '../src/lib/notice.ts';
import sectionIds from '../scripts/rehype-section-ids.mjs';

test('한국 시간 종료일의 마지막 초까지 유효하고 다음 날 종료', () => {
  const meta = { endsOn: '2026-08-31' };
  assert.equal(noticeState(meta, new Date('2026-08-31T14:59:59Z')), 'active');
  assert.equal(noticeState(meta, new Date('2026-08-31T15:00:00Z')), 'closed');
});
test('상시 공지와 수동 종료·보관 상태', () => {
  const now = new Date('2026-10-02T00:00:00Z');
  assert.equal(noticeState({}, now), 'active');
  assert.equal(noticeState({ noticeStatus: 'closed', endsOn: '2027-12-31' }, now), 'closed');
  assert.equal(noticeState({ noticeStatus: 'archived', endsOn: '2026-01-01' }, now), 'archived');
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
