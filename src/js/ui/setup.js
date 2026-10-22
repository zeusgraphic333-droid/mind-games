// The threshold after the Erebus ident: pick a language, pick an experience, walk in (with or without sound).
// Choosing a language re-renders this screen in that language; choosing an experience flips the whole room
// (dark particle world ↔ paper riso world) behind it, live. Returning players see their saved choices.
import gsap from 'gsap';
import { t, lang, setLang } from '../core/i18n.js';
import { mode } from '../core/mode.js';
import { state, save, setSetting } from '../core/state.js';
import { unlockAudio, sfx } from '../core/sfx.js';
import { esc } from '../core/util.js';

const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;

/** tiny live previews of the two experiences */
const PREVIEW = {
  immersive: () => {
    let s = ''; let seed = 11; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 90; i++) { const a = r() * 6.283, d = Math.sqrt(r()); const x = 50 + Math.cos(a) * d * 34, y = 50 + Math.sin(a) * d * 22; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(.5 + r() * 1).toFixed(2)}" fill="${i % 7 === 0 ? '#8B7BFF' : '#EDEBE6'}" opacity="${(.4 + r() * .6).toFixed(2)}" class="pv-d" style="--d:${(r() * 3).toFixed(2)}s"/>`; }
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 50 Q50 24 82 50 Q50 76 18 50 Z" fill="none" stroke="#EDEBE6" stroke-width=".6" stroke-dasharray="1 1.6" opacity=".8"/>${s}<circle cx="50" cy="50" r="8" fill="none" stroke="#8B7BFF" stroke-width="1.2" stroke-dasharray="1 1.4"/></svg>`;
  },
  illustrated: () => `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="40" cy="46" r="20" fill="#FF4DAA" fill-opacity=".9" class="pv-a"/>
      <rect x="44" y="38" width="30" height="30" fill="#2F47E8" fill-opacity=".9" class="pv-b"/>
      <polygon points="30,78 46,52 62,78" fill="#FFE24A" fill-opacity=".95" class="pv-c"/>
      <circle cx="40" cy="46" r="20" fill="none" stroke="#121535" stroke-width="1.2" transform="translate(2 1.5)"/>
    </svg>`
};

/**
 * openSetup({ onMode, onLang }) → Promise<{ sound }>
 * onMode(m) is awaited when the player flips the experience (so the world behind can switch); onLang(l) likewise.
 */
export function openSetup({ onMode = async () => { }, onLang = async () => { } } = {}) {
  return new Promise(resolve => {
    const el = document.createElement('div');
    el.className = 'setup';
    document.body.appendChild(el);
    const back = !!state().name && !!state().settings.lang;
    let busy = false, pending = Promise.resolve();

    const render = () => {
      const m = mode(), l = lang();
      el.dataset.look = m;
      el.innerHTML = `
        <div class="setup__in">
          <p class="setup__kicker">${esc(t('setup.kicker'))}</p>
          <h1 class="setup__title">${esc(t('title.main'))}</h1>
          <p class="setup__sub">${back ? esc(t('setup.back', { name: state().name })) : t(m === 'illustrated' ? 'setup.sub.il' : 'setup.sub')}</p>
          <div class="setup__rows">
            <div class="setup__row" role="radiogroup" aria-label="${esc(t('setup.lang'))}">
              <span class="setup__label">${esc(t('setup.lang'))}</span>
              <div class="seg">
                <button type="button" role="radio" class="seg__b" data-lang="ar" lang="ar" dir="rtl" aria-checked="${l === 'ar'}">العربية</button>
                <button type="button" role="radio" class="seg__b" data-lang="en" lang="en" dir="ltr" aria-checked="${l === 'en'}">English</button>
              </div>
            </div>
            <div class="setup__row" role="radiogroup" aria-label="${esc(t('setup.mode'))}">
              <span class="setup__label">${esc(t('setup.mode'))}</span>
              <div class="modes">
                ${['immersive', 'illustrated'].map(k => `<button type="button" role="radio" class="mode-card mode-card--${k}" data-mode="${k}" aria-checked="${m === k}">
                  <span class="mode-card__pv">${PREVIEW[k]()}</span>
                  <span class="mode-card__t"><b>${esc(t('setup.' + k))}</b><small>${esc(t('setup.' + k + '.sub'))}</small></span>
                </button>`).join('')}
              </div>
            </div>
          </div>
          <div class="setup__acts">
            <button type="button" class="btn btn--solid btn--lg setup__go" data-sound="1"><span>${esc(t(back ? 'setup.continueSound' : 'setup.enterSound'))}</span></button>
            <button type="button" class="btn btn--lg setup__go" data-sound="0"><span>${esc(t('setup.enterSilent'))}</span></button>
          </div>
          ${m === 'immersive' ? `<p class="setup__note">${esc(t('setup.note'))}</p>` : ''}
        </div>`;
      bind();
    };
    const swapIn = () => { if (!reduced()) gsap.from(el.querySelectorAll('.setup__in > *'), { opacity: 0, y: 14, duration: .7, stagger: .05, ease: 'expo.out' }); };

    const bind = () => {
      el.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => {
        if (busy || b.dataset.lang === lang()) return; busy = true;
        pending = (async () => {
          await gsap.to(el.querySelector('.setup__in'), { opacity: 0, duration: reduced() ? 0 : .22 });
          setLang(b.dataset.lang); await onLang(b.dataset.lang);
          render(); swapIn(); busy = false;
          el.querySelector(`[data-lang="${lang()}"]`)?.focus();
        })();
      }));
      el.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
        if (busy || b.dataset.mode === mode()) return; busy = true;
        el.querySelectorAll('[data-mode]').forEach(x => x.setAttribute('aria-checked', String(x === b)));
        el.dataset.look = b.dataset.mode; // the room flips colour first (CSS transition), the world follows
        pending = (async () => {
          await onMode(b.dataset.mode);
          render(); busy = false;
          el.querySelector(`[data-mode="${mode()}"]`)?.focus();
        })();
      }));
      // walking in mid-switch waits for the switch to land (so the title is printed in the language you picked)
      el.querySelectorAll('.setup__go').forEach(b => b.addEventListener('click', async () => {
        if (el.classList.contains('is-out')) return;
        el.classList.add('is-out');
        const sound = b.dataset.sound === '1';
        setSetting('sound', sound); unlockAudio(); if (sound) sfx('whoosh'); // inside the gesture
        await pending;
        if (!state().settings.lang) state().settings.lang = lang();
        if (!state().settings.mode) state().settings.mode = mode();
        save();
        gsap.to(el.querySelector('.setup__in'), { opacity: 0, y: -10, duration: reduced() ? 0 : .5, ease: 'power2.in', onComplete: () => { el.remove(); } });
        resolve({ sound });
      }));
    };

    render();
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: reduced() ? 0 : .9, ease: 'power2.out' });
    swapIn();
    setTimeout(() => el.querySelector('.setup__go')?.focus({ preventScroll: true }), 400);
  });
}
