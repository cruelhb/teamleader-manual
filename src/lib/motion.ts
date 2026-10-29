/**
 * 화면 움직임 효과 (efusioni.com 을 참고).
 *
 * 1) 나타나기 — [data-reveal] 요소가 화면에 들어오면 아래에서 살짝 떠오르며 보인다.
 *    같은 묶음 안에서는 순서대로 조금씩 늦게 나타난다(--reveal-delay).
 * 2) 기울이기 — PC에서 [data-tilt] 카드 위에 마우스를 올리면 마우스 쪽이 살짝 눌리듯 기울고
 *    빛이 비친다(--rx, --ry, --mx, --my). 휴대폰(터치)에서는 쓰지 않는다.
 *
 * <html class="motion"> 일 때만 동작한다. 기기의 "동작 줄이기" 설정이 켜져 있으면
 * BaseLayout 이 이 클래스를 붙이지 않으므로 모든 효과가 꺼지고 내용은 그대로 보인다.
 */

const MAX_TILT_DEG = 7;

export function initMotion(): void {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;

  initReveal();

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (finePointer.matches) initTilt();
}

function initReveal(): void {
  const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (targets.length === 0) return;

  // 같은 부모 안의 형제끼리 순서대로 지연을 준다 (최대 6단계까지만 — 너무 늦으면 답답하다)
  targets.forEach((target) => {
    const siblings = [...(target.parentElement?.children ?? [])].filter((el) => el.hasAttribute('data-reveal'));
    const index = Math.min(siblings.indexOf(target), 5);
    target.style.setProperty('--reveal-delay', `${index * 70}ms`);
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  // 문서 본문처럼 화면보다 훨씬 긴 카드도 있으므로 "윗부분이 조금 들어오면" 바로 보이게 한다.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });

  targets.forEach((target) => observer.observe(target));
}

function initTilt(): void {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    let frame = 0;

    card.addEventListener('pointermove', (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;  // 0 ~ 1
        const y = (event.clientY - rect.top) / rect.height;  // 0 ~ 1
        // 마우스가 있는 쪽이 살짝 눌려 들어가도록 기운다 (efusioni 와 같은 방향)
        card.style.setProperty('--ry', `${((0.5 - x) * MAX_TILT_DEG * 2).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((y - 0.5) * MAX_TILT_DEG * 2).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      });
    });

    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
}
