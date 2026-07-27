/**
 * 한글 초성 검색 유틸.
 *
 * 목표: "ㄱㅈㅎㄱ" 을 치면 "경조휴가" 가 나오고, 타이핑 중간 상태인
 * "경조ㅎ" 으로도 "경조휴가" 가 걸리게 한다.
 *
 * 한글 음절은 유니코드 U+AC00~U+D7A3 에 초성×중성×종성 순으로 배열되어 있다.
 *   음절코드 = 0xAC00 + (초성index * 588) + (중성index * 28) + 종성index
 * 따라서 초성은 (음절코드 - 0xAC00) / 588 로 구한다. (588 = 21중성 * 28종성)
 */

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const CHOSEONG_UNIT = 588;

/** 초성 19자 (유니코드 배열 순서 그대로 — 순서를 바꾸면 안 된다) */
const CHOSEONG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

const CHOSEONG_SET = new Set<string>(CHOSEONG_LIST);

/**
 * 된소리 관대 매칭.
 * 사용자가 "ㄱ" 을 쳤을 때 "까다로운" 같은 ㄲ 단어도 걸리게 한다.
 * 반대로 "ㄲ" 을 명시적으로 쳤다면 ㄲ 만 매칭한다.
 */
const LOOSE_CHOSEONG: Record<string, string[]> = {
  ㄱ: ['ㄱ', 'ㄲ'],
  ㄷ: ['ㄷ', 'ㄸ'],
  ㅂ: ['ㅂ', 'ㅃ'],
  ㅅ: ['ㅅ', 'ㅆ'],
  ㅈ: ['ㅈ', 'ㅉ'],
};

/** 이 글자가 완성된 한글 음절인가 (가~힣) */
export function isHangulSyllable(char: string): boolean {
  const code = char.codePointAt(0);
  return code !== undefined && code >= HANGUL_START && code <= HANGUL_END;
}

/** 이 글자가 단독 자음(초성으로 쓸 수 있는 낱자)인가 */
export function isChoseongJamo(char: string): boolean {
  return CHOSEONG_SET.has(char);
}

/** 음절 하나의 초성을 반환. 한글이 아니면 글자를 그대로 돌려준다. */
export function choseongOf(char: string): string {
  const code = char.codePointAt(0);
  if (code === undefined || code < HANGUL_START || code > HANGUL_END) return char;
  return CHOSEONG_LIST[Math.floor((code - HANGUL_START) / CHOSEONG_UNIT)];
}

/** 문자열 전체를 초성으로 변환. "경조휴가" -> "ㄱㅈㅎㄱ" */
export function toChoseong(text: string): string {
  let out = '';
  for (const char of text) out += choseongOf(char);
  return out;
}

/** 검색어에 단독 자음이 하나라도 들어있는가 (초성 검색을 시도할 가치가 있는가) */
export function hasChoseongJamo(text: string): boolean {
  for (const char of text) {
    if (isChoseongJamo(char)) return true;
  }
  return false;
}

/** 비교용 정규화: 공백 제거 + 소문자화 */
export function normalize(text: string): string {
  return text.replace(/\s+/g, '').toLowerCase();
}

/** 검색어 한 글자가 대상 한 글자와 맞는지 */
function charMatches(target: string, query: string): boolean {
  if (target === query) return true;

  // 검색어가 단독 자음이면 대상 음절의 초성과 비교한다.
  if (isChoseongJamo(query)) {
    if (!isHangulSyllable(target)) return false;
    const targetCho = choseongOf(target);
    const accepted = LOOSE_CHOSEONG[query] ?? [query];
    return accepted.includes(targetCho);
  }

  return false;
}

/**
 * 초성 + 완성글자 혼합 검색.
 *
 * "ㄱㅈㅎㄱ"  → "경조휴가" ✓
 * "경조ㅎ"    → "경조휴가" ✓   (IME 조합 중간 상태)
 * "조휴"      → "경조휴가" ✓   (부분 일치)
 *
 * 이미 normalize() 된 문자열을 넘겨야 한다.
 */
export function koreanIncludes(text: string, query: string): boolean {
  if (!query) return true;

  const targetChars = [...text];
  const queryChars = [...query];
  const limit = targetChars.length - queryChars.length;

  for (let start = 0; start <= limit; start++) {
    let matched = true;
    for (let offset = 0; offset < queryChars.length; offset++) {
      if (!charMatches(targetChars[start + offset], queryChars[offset])) {
        matched = false;
        break;
      }
    }
    if (matched) return true;
  }

  return false;
}

/**
 * 문자열 맨 앞에서부터 일치하는지. 앞에서 걸린 결과에 가산점을 주기 위해 쓴다.
 * 이미 normalize() 된 문자열을 넘겨야 한다.
 */
export function koreanStartsWith(text: string, query: string): boolean {
  if (!query) return true;

  const targetChars = [...text];
  const queryChars = [...query];
  if (queryChars.length > targetChars.length) return false;

  return queryChars.every((queryChar, index) => charMatches(targetChars[index], queryChar));
}
