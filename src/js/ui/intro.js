// Preloader → gate (enter with / without sound) → the title assembles from particles → the eye opens.
import gsap from 'gsap';
import { state, setSetting, award, save } from '../core/state.js';
import { unlockAudio, sfx } from '../core/sfx.js';
import { GLYPH, SIGILS } from './glyphs.js';
import { esc } from '../core/util.js';

export function mountIntro() {
  const back = state().name; const lvTxt = back ? `أهلًا تاني يا ${esc(state().name)} — كمّل من مكان ما وقفت.` : '';
  const el = document.createElement('div');
  el.className = 'intro';
  el.innerHTML = `
    <div class="intro__load"><span class="hud-num intro__count">000</span><div class="bar"><i></i></div><p>بنصحّي عقلك…</p></div>
    <div class="intro__gate" hidden>
      <p class="intro__kicker"><span class="hud-num">MDP001</span> · Graphic Fundamentals · Lecture 02 + 03</p>
      <h1 class="intro__title"><span class="mask"><span>عقلك</span></span> <span class="mask"><span>بيشتغلك.</span></span></h1>
      <p class="intro__sub">${back ? lvTxt : 'كل اللي هتشوفه هنا معمول من نقط. ومخّك هو اللي بيجمّعها.<br>ده بالظبط اللي بتدرسه.'}</p>
      <div class="intro__acts"><button type="button" class="btn btn--solid btn--lg" data-sound="1">${GLYPH.infinity.replace('<svg', '<svg class="glyph-ico"')}<span>${back ? 'كمّل بالصوت' : 'ادخل بالصوت'}</span></button><button type="button" class="btn btn--lg" data-sound="0"><span>من غير صوت</span></button></div>
      <p class="intro__note">سمّاعة وأوضة ضلمة؟ هتفرق.</p>
    </div>`;
  document.body.appendChild(el);
  const count = el.querySelector('.intro__count'), bar = el.querySelector('.bar i');
  const prog = { v: 0 };
  let target = 0;
  const tick = () => { prog.v += (target - prog.v) * .12; count.textContent = String(Math.round(prog.v)).padStart(3, '0'); bar.style.setProperty('--p', prog.v / 100); if (prog.v < 99.5 || target < 100) raf = requestAnimationFrame(tick); else count.textContent = '100'; };
  let raf = requestAnimationFrame(tick);
  return {
    progress(p) { target = Math.max(target, Math.min(100, p)); },
    /** resolves with the sound choice once the player walks in */
    gate() {
      target = 100;
      if (location.search.includes('skipintro')) return Promise.resolve(false);
      return new Promise(res => {
        setTimeout(() => {
          el.querySelector('.intro__load').classList.add('is-out');
          const g = el.querySelector('.intro__gate'); g.hidden = false;
          requestAnimationFrame(() => g.classList.add('in'));
          el.querySelectorAll('[data-sound]').forEach(b => b.addEventListener('click', () => {
            const on = b.dataset.sound === '1'; setSetting('sound', on); unlockAudio(); if (on) sfx('whoosh');
            g.classList.add('is-out');
            res(on);
          }, { once: true }));
          el.querySelector('[data-sound="1"]').focus({ preventScroll: true });
        }, 450);
      });
    },
    close() { el.classList.add('is-out'); setTimeout(() => { el.remove(); cancelAnimationFrame(raf); }, 900); }
  };
}

/** first visit: name + sigil */
export function onboarding() {
  return new Promise(res => {
    const S = state(); let pick = S.sigil || 'circle';
    const el = document.createElement('div'); el.className = 'onb';
    el.innerHTML = `<form class="onb__card" autocomplete="off">
      <p class="label"><b>01</b> قبل ما تدخل</p>
      <h2>اسمك إيه؟</h2>
      <input class="onb__name" name="n" maxlength="18" placeholder="اكتب اسمك أو لقبك" aria-label="اسمك" value="${esc(S.name || '')}">
      <h3><span class="label"><b>02</b></span> اختار رمزك</h3>
      <div class="sigils" role="radiogroup" aria-label="رمزك">${SIGILS.map(s => `<button type="button" role="radio" class="sigil" data-k="${s.k}" aria-checked="${s.k === pick}"><span class="sigil__g">${GLYPH[s.k]}</span><b>${s.ar}</b><small>${s.d}</small></button>`).join('')}</div>
      <p class="onb__note">الرمز ده هيبقى توقيعك. كل شكل ليه شخصية، وده أول درس في المنهج.</p>
      <button type="submit" class="btn btn--solid btn--lg btn--block">يلا بينا</button>
    </form>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    const input = el.querySelector('.onb__name'); setTimeout(() => input.focus(), 600);
    el.querySelectorAll('.sigil').forEach(b => b.addEventListener('click', () => { pick = b.dataset.k; el.querySelectorAll('.sigil').forEach(x => x.setAttribute('aria-checked', String(x === b))); sfx('pop'); }));
    el.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      S.name = (input.value || '').trim().slice(0, 18) || 'ضيف'; S.sigil = pick; save();
      award('hello'); sfx('level');
      el.classList.remove('in'); el.classList.add('is-out'); setTimeout(() => el.remove(), 700);
      res();
    });
  });
}
