<script>
  import { onMount, onDestroy } from 'svelte';

  export let volume;
  export let power;
  export let sound;
  export let accentClass;
  export let onPlay;

  let padEl;
  let canvasEl;
  let particles = [];
  let rafId = null;
  let active = false;
  let ringScale = 0;
  let ringOpacity = 0;
  let idlePhase = 0;
  let tiltX = 0;
  let tiltY = 0;
  let audioCtx = null;
  let audioEl;
  let timer;
  let flashOpacity = 0;
  let audioLevel = 0;

  function getCtx() {
    if (!audioCtx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function makeNoiseBuffer(ctx, durationSec) {
    const len = Math.floor(ctx.sampleRate * durationSec);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
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

  function getAccent() {
    if (accentClass.includes('amber')) return { r: 251, g: 191, b: 36 };
    if (accentClass.includes('cyan')) return { r: 34, g: 211, b: 238 };
    if (accentClass.includes('rose')) return { r: 251, g: 113, b: 133 };
    return { r: 34, g: 211, b: 238 };
  }

  function spawnParticles(w, h, count = 32) {
    const { r, g, b } = getAccent();
    const color = `rgb(${r}, ${g}, ${b})`;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 4;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      const edgeX = cx + Math.cos(angle) * radius * 0.7;
      const edgeY = cy + Math.sin(angle) * radius * 0.7;
      const inward = -1;
      particles.push({
        x: edgeX,
        y: edgeY,
        vx: Math.cos(angle) * speed * 0.4 + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed * 0.4 + (Math.random() - 0.5) * 2 - 1,
        size: 2 + Math.random() * 3.5,
        life: 1,
        decay: 0.012 + Math.random() * 0.018,
        color,
      });
    }
  }

  function tick() {
    idlePhase += 0.018;

    if (canvasEl) {
      const dpr = window.devicePixelRatio || 1;
      const w = canvasEl.width / dpr;
      const h = canvasEl.height / dpr;
      const ctx = canvasEl.getContext('2d');
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 4;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.14;
        p.vx *= 0.985;
        p.life -= p.decay;
        p.size *= 0.975;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    if (ringOpacity > 0.01) {
      ringScale = Math.min(2.6, ringScale + 0.05);
      ringOpacity *= 0.93;
    } else {
      ringOpacity = 0;
      ringScale = 0.6;
    }

    if (flashOpacity > 0.01) {
      flashOpacity *= 0.88;
    } else {
      flashOpacity = 0;
    }

    rafId = requestAnimationFrame(tick);
  }

  function handleMouseMove(e) {
    if (!padEl || !power) return;
    const rect = padEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    tiltX = Math.max(-1, Math.min(1, dy)) * -10;
    tiltY = Math.max(-1, Math.min(1, dx)) * 10;
  }

  function handleLeave() {
    tiltX = 0;
    tiltY = 0;
  }

  function trigger() {
    if (!power) return;
    if (sound.note !== undefined) playPiano(sound.note);
    else if (sound.synth !== undefined) playPercussion(sound.synth);
    else playSample();

    active = true;
    onPlay(sound.id);

    if (canvasEl) {
      const dpr = window.devicePixelRatio || 1;
      spawnParticles(canvasEl.width / dpr, canvasEl.height / dpr);
    }
    ringScale = 0.6;
    ringOpacity = 1;
    flashOpacity = 1;

    clearTimeout(timer);
    timer = setTimeout(() => (active = false), 180);
  }

  function handleKey(e) {
    if (e.keyCode === sound.keyCode) {
      e.preventDefault();
      trigger();
    }
  }

  function resizeCanvas() {
    if (!canvasEl) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvasEl.getBoundingClientRect();
    canvasEl.width = rect.width * dpr;
    canvasEl.height = rect.height * dpr;
    const ctx = canvasEl.getContext('2d');
    ctx.scale(dpr, dpr);
  }

  onMount(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (padEl) ro.observe(padEl);
    rafId = requestAnimationFrame(tick);
    document.addEventListener('keydown', handleKey);
    return () => {
      ro.disconnect();
      document.removeEventListener('keydown', handleKey);
    };
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
    clearTimeout(timer);
  });

  $: accent = getAccent();
  $: accentStr = `rgb(${accent.r}, ${accent.g}, ${accent.b})`;
  $: idleBreath = 0.96 + Math.sin(idlePhase) * 0.015;
  $: tiltTransform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${active ? 0.94 : idleBreath})`;
</script>

<button
  bind:this={padEl}
  id={sound.id}
  on:click={trigger}
  on:mousemove={handleMouseMove}
  on:mouseleave={handleLeave}
  disabled={!power}
  aria-label={`${sound.id} (${sound.keyTrigger})`}
  class="surprise-pad group relative aspect-square w-full rounded-2xl flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
  class:cursor-not-allowed={!power}
  class:opacity-40={!power}
>
  <div
    class="absolute inset-0 rounded-2xl transition-transform duration-200 ease-out"
    style="transform: {tiltTransform}; transform-style: preserve-3d;"
  >
    <svg viewBox="0 0 100 100" class="w-full h-full absolute inset-0 pointer-events-none">
      <defs>
        <radialGradient id="pad-grad-{sound.id}" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#475569" />
          <stop offset="55%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#020617" />
        </radialGradient>
        <radialGradient id="pad-glow-{sound.id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color={accentStr} stop-opacity="0.6" />
          <stop offset="60%" stop-color={accentStr} stop-opacity="0.15" />
          <stop offset="100%" stop-color={accentStr} stop-opacity="0" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill="url(#pad-grad-{sound.id})" />
      <circle cx="50" cy="50" r="48" fill="url(#pad-glow-{sound.id})" opacity={active ? 1 : 0.25} />

      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        stroke-width="0.5"
      />
    </svg>

    <div
      class="absolute inset-3 rounded-full border pointer-events-none transition-all duration-150"
      style="border-color: {accentStr}; opacity: {active ? 0.95 : 0.5}; box-shadow: 0 0 {active ? 18 : 6}px {active ? 4 : 0}px {accentStr}, inset 0 0 {active ? 16 : 4}px {accentStr};"
    ></div>

    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span
        class="font-mono font-black text-3xl sm:text-4xl md:text-5xl leading-none transition-all duration-150"
        style="color: {active ? '#fff' : '#e2e8f0'}; text-shadow: {active ? `0 0 12px ${accentStr}, 0 0 24px ${accentStr}` : '0 1px 2px rgba(0,0,0,0.6)'};"
      >
        {sound.keyTrigger}
      </span>
      <span
        class="mt-1 px-1.5 text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.18em] font-bold transition-colors duration-150 truncate max-w-[80%]"
        style="color: {active ? accentStr : 'rgba(148,163,184,0.9)'}; text-shadow: 0 0 {active ? 8 : 0}px {accentStr};"
      >
        {sound.id}
      </span>
    </div>

    {#if ringOpacity > 0}
      <div
        class="absolute inset-0 rounded-full border-2 pointer-events-none"
        style="border-color: {accentStr}; transform: scale({ringScale}); opacity: {ringOpacity}; box-shadow: 0 0 24px {accentStr};"
      ></div>
    {/if}
    {#if ringOpacity > 0}
      <div
        class="absolute inset-0 rounded-full border pointer-events-none"
        style="border-color: {accentStr}; transform: scale({ringScale * 1.15}); opacity: {ringOpacity * 0.6}; "
      ></div>
    {/if}

    {#if flashOpacity > 0}
      <div
        class="absolute inset-3 rounded-full pointer-events-none"
        style="background: radial-gradient(circle, {accentStr} 0%, transparent 70%); opacity: {flashOpacity * 0.5};"
      ></div>
    {/if}

    <canvas
      bind:this={canvasEl}
      class="absolute inset-0 w-full h-full pointer-events-none"
    ></canvas>
  </div>
</button>

{#if sound.url}
  <audio
    bind:this={audioEl}
    preload="auto"
    class="hidden"
    src={sound.url}
  ></audio>
{/if}

<style>
  .surprise-pad {
    overflow: visible;
  }
  .surprise-pad:disabled {
    cursor: not-allowed;
  }
  .surprise-pad:not(:disabled):hover > div {
    filter: brightness(1.08);
  }
</style>