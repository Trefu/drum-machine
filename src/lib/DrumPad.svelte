<script>
  import { onMount, onDestroy } from 'svelte';

  export let volume;
  export let power;
  export let sound;
  export let accentClass;
  export let onPlay;

  let audioEl;
  let active = false;
  let timer;
  let audioCtx = null;

  function getCtx() {
    if (!audioCtx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function makeNoiseBuffer(ctx, durationSec) {
    const len = Math.floor(ctx.sampleRate * durationSec);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buf;
  }

  function envGain(ctx, now, attack, decay, peak) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
    return g;
  }

  function playSample() {
    if (!audioEl) return;
    audioEl.currentTime = 0;
    audioEl.volume = volume;
    audioEl.play().catch(() => {});
  }

  function playPiano(frequency) {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const dur = 1.4;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const peak = Math.max(0.0001, volume * 0.9);
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(peak, now + 0.005);
    master.gain.exponentialRampToValueAtTime(peak * 0.45, now + 0.18);
    master.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = frequency;
    const g1 = ctx.createGain();
    g1.gain.value = 0.55;
    osc1.connect(g1).connect(master);
    osc1.start(now);
    osc1.stop(now + dur + 0.05);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = frequency * 2;
    const g2 = ctx.createGain();
    g2.gain.value = 0.18;
    osc2.connect(g2).connect(master);
    osc2.start(now);
    osc2.stop(now + dur + 0.05);

    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = frequency / 2;
    const g3 = ctx.createGain();
    g3.gain.value = 0.22;
    osc3.connect(g3).connect(master);
    osc3.start(now);
    osc3.stop(now + dur + 0.05);
  }

  function playPercussion(type) {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const peak = Math.max(0.0001, volume);

    switch (type) {
      case 'kick': {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        const g = envGain(ctx, now, 0.005, 0.35, peak);
        osc.connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
        break;
      }
      case 'snare': {
        const noise = ctx.createBufferSource();
        noise.buffer = makeNoiseBuffer(ctx, 0.25);
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 1500;
        const nGain = envGain(ctx, now, 0.002, 0.18, peak * 0.8);
        noise.connect(hp).connect(nGain).connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.25);

        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);
        const oGain = envGain(ctx, now, 0.002, 0.1, peak * 0.55);
        osc.connect(oGain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case 'hat-closed': {
        const noise = ctx.createBufferSource();
        noise.buffer = makeNoiseBuffer(ctx, 0.08);
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 8000;
        const g = envGain(ctx, now, 0.001, 0.05, peak * 0.6);
        noise.connect(hp).connect(g).connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.08);
        break;
      }
      case 'hat-open': {
        const noise = ctx.createBufferSource();
        noise.buffer = makeNoiseBuffer(ctx, 0.35);
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 7000;
        const g = envGain(ctx, now, 0.002, 0.3, peak * 0.55);
        noise.connect(hp).connect(g).connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.4);
        break;
      }
      case 'tom-high': {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
        const g = envGain(ctx, now, 0.003, 0.25, peak * 0.85);
        osc.connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
        break;
      }
      case 'tom-low': {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
        const g = envGain(ctx, now, 0.003, 0.3, peak * 0.85);
        osc.connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case 'clap': {
        for (let i = 0; i < 3; i++) {
          const t = now + i * 0.012;
          const noise = ctx.createBufferSource();
          noise.buffer = makeNoiseBuffer(ctx, 0.04);
          const bp = ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.value = 2500;
          const g = envGain(ctx, t, 0.001, 0.04, peak * 0.7);
          noise.connect(bp).connect(g).connect(ctx.destination);
          noise.start(t);
          noise.stop(t + 0.06);
        }
        const tail = ctx.createBufferSource();
        tail.buffer = makeNoiseBuffer(ctx, 0.18);
        const bp2 = ctx.createBiquadFilter();
        bp2.type = 'bandpass';
        bp2.frequency.value = 1800;
        const tg = envGain(ctx, now + 0.04, 0.002, 0.16, peak * 0.35);
        tail.connect(bp2).connect(tg).connect(ctx.destination);
        tail.start(now + 0.04);
        tail.stop(now + 0.25);
        break;
      }
      case 'cowbell': {
        const o1 = ctx.createOscillator();
        o1.type = 'square';
        o1.frequency.value = 845;
        const g1 = envGain(ctx, now, 0.002, 0.18, peak * 0.25);
        o1.connect(g1).connect(ctx.destination);
        o1.start(now);
        o1.stop(now + 0.22);

        const o2 = ctx.createOscillator();
        o2.type = 'square';
        o2.frequency.value = 587;
        const g2 = envGain(ctx, now, 0.002, 0.18, peak * 0.25);
        o2.connect(g2).connect(ctx.destination);
        o2.start(now);
        o2.stop(now + 0.22);
        break;
      }
      case 'cymbal': {
        const noise = ctx.createBufferSource();
        noise.buffer = makeNoiseBuffer(ctx, 1.2);
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 6000;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 9000;
        bp.Q.value = 0.6;
        const g = envGain(ctx, now, 0.002, 0.9, peak * 0.45);
        noise.connect(hp).connect(bp).connect(g).connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 1.2);
        break;
      }
    }
  }

  function trigger() {
    if (!power) return;
    if (sound.note !== undefined) {
      playPiano(sound.note);
    } else if (sound.synth !== undefined) {
      playPercussion(sound.synth);
    } else {
      playSample();
    }
    active = true;
    onPlay(sound.id);
    clearTimeout(timer);
    timer = setTimeout(() => (active = false), 160);
  }

  function handleKey(e) {
    if (e.keyCode === sound.keyCode) {
      e.preventDefault();
      trigger();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKey);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleKey);
    clearTimeout(timer);
  });
</script>

<button
  id={sound.id}
  class="drum-pad group relative aspect-square rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border border-slate-600/80 shadow-[0_6px_0_0_rgba(15,23,42,0.9),0_12px_24px_-6px_rgba(0,0,0,0.6)] transition-all duration-100 ease-out select-none overflow-hidden min-w-0 min-h-0"
  class:opacity-40={!power}
  class:grayscale={!power}
  class:cursor-not-allowed={!power}
  class:cursor-pointer={power}
  class:translate-y-[2px]={active}
  class:scale-[0.97]={active}
  class:!shadow-press={active}
  class:!border-transparent={active}
  class:pad-active={active}
  on:click={trigger}
  disabled={!power}
>
  <span
    class="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-150 group-hover:opacity-40"
    class:opacity-100={active}
    style="background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18), transparent 60%);"
  ></span>

  <span
    class="pointer-events-none absolute top-2 right-2 h-2.5 w-2.5 rounded-full transition-all duration-150 bg-slate-500/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
    class:led-active={active}
    class:scale-110={active}
    class:bg-amber-400={active && accentClass.includes('amber')}
    class:!bg-cyan-400={active && accentClass.includes('cyan')}
    class:!bg-rose-400={active && accentClass.includes('rose')}
  ></span>

  <span
    class="relative font-mono font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-200 transition-colors duration-150 group-hover:text-white leading-none"
    class:!text-white={active}
    class:drop-shadow-glow={active}
  >
    {sound.keyTrigger}
  </span>

  <span
    class="relative mt-1 px-1 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] font-semibold text-slate-400 transition-colors duration-150 group-hover:text-slate-300 truncate max-w-full leading-tight"
    class:!text-white={active}
  >
    {sound.id}
  </span>

  {#if sound.url}
    <audio
      bind:this={audioEl}
      id={sound.keyTrigger}
      preload="auto"
      class="hidden"
      src={sound.url}
    ></audio>
  {/if}
</button>

<style>
  .drum-pad:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 0 0 rgba(15, 23, 42, 0.9), 0 18px 28px -6px rgba(0, 0, 0, 0.7);
  }
  .pad-active {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.25) inset,
      0 0 24px 0 rgba(255, 255, 255, 0.15),
      0 2px 0 0 rgba(15, 23, 42, 0.9) !important;
  }
  .led-active {
    box-shadow:
      0 0 12px 2px currentColor,
      0 0 24px 4px rgba(255, 255, 255, 0.2) inset !important;
  }
  :global(.led-active.bg-amber-400) {
    color: rgba(251, 191, 36, 0.9);
  }
  :global(.led-active.bg-cyan-400) {
    color: rgba(34, 211, 238, 0.9);
  }
  :global(.led-active.bg-rose-400) {
    color: rgba(251, 113, 133, 0.9);
  }
  .drop-shadow-glow {
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  }
</style>