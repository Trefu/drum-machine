<script>
  import { onMount, onDestroy } from 'svelte';

  export let volume;
  export let power;
  export let sound;
  export let accentClass;
  export let ledClass;
  export let onPlay;

  let audioEl;
  let active = false;
  let timer;

  function trigger() {
    if (!power || !audioEl) return;
    audioEl.currentTime = 0;
    audioEl.volume = volume;
    audioEl.play().catch(() => {});
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
  class="drum-pad group relative aspect-square rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border border-slate-600/80 shadow-[0_6px_0_0_rgba(15,23,42,0.9),0_12px_24px_-6px_rgba(0,0,0,0.6)] transition-all duration-100 ease-out select-none"
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
  ></span>

  <span
    class="relative font-mono font-extrabold text-3xl md:text-4xl text-slate-200 transition-colors duration-150 group-hover:text-white"
    class:!text-white={active}
    class:drop-shadow-glow={active}
  >
    {sound.keyTrigger}
  </span>

  <span
    class="relative mt-1 text-[10px] md:text-xs uppercase tracking-[0.18em] font-semibold text-slate-400 transition-colors duration-150 group-hover:text-slate-300"
    class:!text-white={active}
  >
    {sound.id}
  </span>

  <audio
    bind:this={audioEl}
    id={sound.keyTrigger}
    preload="auto"
    class="hidden"
    src={sound.url}
  ></audio>
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
  .led-active.bg-amber-400 {
    color: rgba(251, 191, 36, 0.9);
  }
  .led-active.bg-cyan-400 {
    color: rgba(34, 211, 238, 0.9);
  }
  .drop-shadow-glow {
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  }
</style>