<script>
  import { onMount, onDestroy } from 'svelte';

  export let volume;
  export let setVolume;
  export let power;
  export let setPower;
  export let actualSound;
  export let banks;
  export let bankIndex;
  export let setBankIndex;

  let menuOpen = false;
  let menuEl;
  let buttonEl;

  function handleRange(e) {
    setVolume(parseFloat(e.target.value));
  }

  function handlePower() {
    setPower(!power);
  }

  function toggleMenu() {
    if (!power) return;
    menuOpen = !menuOpen;
  }

  function selectBank(i) {
    setBankIndex(i);
    menuOpen = false;
  }

  function handleDocClick(e) {
    if (!menuOpen) return;
    if (menuEl && menuEl.contains(e.target)) return;
    if (buttonEl && buttonEl.contains(e.target)) return;
    menuOpen = false;
  }

  onMount(() => {
    document.addEventListener('mousedown', handleDocClick);
    document.addEventListener('keydown', handleEsc);
  });

  onDestroy(() => {
    document.removeEventListener('mousedown', handleDocClick);
    document.removeEventListener('keydown', handleEsc);
  });

  function handleEsc(e) {
    if (e.key === 'Escape') menuOpen = false;
  }

  $: volPct = Math.round(volume * 100);
  $: ledColor = banks[bankIndex].led.includes('amber')
    ? 'bg-amber-400'
    : banks[bankIndex].led.includes('cyan')
    ? 'bg-cyan-400'
    : 'bg-rose-400';
</script>

<div
  id="display"
  class="w-full md:w-80 shrink-0 flex flex-col gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_20px_40px_-12px_rgba(0,0,0,0.7)]"
>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span
        class="h-2.5 w-2.5 rounded-full transition-all duration-200 bg-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
        class:{ledColor}={power}
        class:shadow-led={power}
      ></span>
      <span class="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
        {power ? 'Power On' : 'Power Off'}
      </span>
    </div>
  </div>

  <div
    class="relative rounded-xl overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-800/60 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-opacity duration-300"
    class:opacity-40={!power}
    class:opacity-100={power}
  >
    <div
      class="pointer-events-none absolute inset-0"
      style="background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px);"
    ></div>
    <div class="relative px-4 py-5 min-h-[96px] flex flex-col justify-center">
      <span class="text-[10px] uppercase tracking-[0.25em] text-emerald-400/70 font-mono">
        Now Playing
      </span>
      {#key actualSound}
        <span
          class="mt-1 font-mono text-2xl md:text-3xl font-bold text-emerald-300 animate-lcd-flash truncate"
          style="text-shadow: 0 0 6px rgba(110,231,183,0.7), 0 0 14px rgba(110,231,183,0.35);"
        >
          {power && actualSound !== '—' ? actualSound : '—'}
        </span>
      {/key}
    </div>
  </div>

  <div class="relative">
    <button
      bind:this={buttonEl}
      on:click={toggleMenu}
      disabled={!power}
      class="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-left bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/70 shadow-[0_3px_0_0_rgba(15,23,42,0.9)] transition-all duration-150 min-h-[96px]"
      class:hover:-translate-y-px={power}
      class:active:translate-y-px={power}
      class:active:shadow-none={power}
      class:cursor-pointer={power}
      class:opacity-50={!power}
      class:cursor-not-allowed={!power}
    >
      <span class="block text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
        Sound Bank
      </span>
      <span class="mt-0.5 flex items-baseline justify-between pr-6 gap-2">
        <span class="text-base font-bold text-white truncate min-w-0">{banks[bankIndex].name}</span>
        <span class="text-[10px] font-mono text-slate-400 shrink-0">
          {String(bankIndex + 1).padStart(2, '0')}/{String(banks.length).padStart(2, '0')}
        </span>
      </span>
      <span class="block text-[11px] text-slate-400 mt-0.5 truncate whitespace-nowrap">
        {banks[bankIndex].subtitle}
      </span>
      <span
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-slate-300 transition-transform duration-200"
        class:rotate-180={menuOpen}
      >
        ⌄
      </span>
    </button>

    {#if menuOpen}
      <div
        bind:this={menuEl}
        class="absolute left-0 right-0 top-full mt-1.5 z-20 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 shadow-[0_12px_24px_-6px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden animate-menu-open"
      >
        {#each banks as bank, i}
          <button
            type="button"
            on:click={() => selectBank(i)}
            class="w-full text-left px-4 py-2.5 transition-colors duration-150 border-b border-slate-700/60 last:border-b-0 hover:bg-slate-700/70"
            class:bg-slate-700={i === bankIndex}
          >
            <span class="flex items-center justify-between gap-2">
              <span class="flex items-center gap-2 min-w-0">
                <span
                  class="h-2 w-2 rounded-full shrink-0 bg-slate-500"
                  class:bg-amber-400={i === bankIndex && bank.accent.includes('amber')}
                  class:bg-cyan-400={i === bankIndex && bank.accent.includes('cyan')}
                  class:bg-rose-400={i === bankIndex && bank.accent.includes('rose')}
                  class:shadow-dot-led={i === bankIndex}
                ></span>
                <span class="text-sm font-semibold text-white truncate">{bank.name}</span>
              </span>
              {#if i === bankIndex}
                <span class="text-emerald-400 text-xs font-mono">✓</span>
              {/if}
            </span>
            <span class="block text-[11px] text-slate-400 mt-0.5 ml-4">{bank.subtitle}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/70 p-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
        Volume
      </span>
      <span class="font-mono text-sm text-white tabular-nums">{volPct}</span>
    </div>
    <div class="relative h-2 rounded-full bg-slate-900 overflow-hidden mb-3 border border-slate-700">
      <div
        class="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 transition-all duration-150"
        style="width: {volPct}%"
      ></div>
      <div
        class="absolute inset-0 pointer-events-none"
        style="background-image: repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 8px);"
      ></div>
    </div>
    <input
      aria-label="Volume"
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={volume}
      on:input={handleRange}
      class="volume-slider w-full accent-emerald-400"
    />
  </div>

  <button
    on:click={handlePower}
    class="relative h-12 rounded-xl font-bold text-sm uppercase tracking-[0.2em] border transition-all duration-200 bg-gradient-to-b from-slate-700 to-slate-800 border-slate-600 text-slate-300"
    class:from-emerald-500={power}
    class:to-emerald-700={power}
    class:border-emerald-400={power}
    class:text-white={power}
    class:shadow-power={power}
  >
    {power ? 'Power · On' : 'Power · Off'}
  </button>
</div>

<style>
  :global(.shadow-led.bg-amber-400) {
    color: rgba(251, 191, 36, 0.9);
  }
  :global(.shadow-led.bg-cyan-400) {
    color: rgba(34, 211, 238, 0.9);
  }
  :global(.shadow-led.bg-rose-400) {
    color: rgba(251, 113, 133, 0.9);
  }
  .shadow-power {
    box-shadow: 0 0 18px 2px rgba(16, 185, 129, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }
  :global(.shadow-dot-led.bg-amber-400) {
    box-shadow: 0 0 8px 1px rgba(251, 191, 36, 0.7);
  }
  :global(.shadow-dot-led.bg-cyan-400) {
    box-shadow: 0 0 8px 1px rgba(34, 211, 238, 0.7);
  }
  :global(.shadow-dot-led.bg-rose-400) {
    box-shadow: 0 0 8px 1px rgba(251, 113, 133, 0.7);
  }

  @keyframes menu-open {
    from {
      opacity: 0;
      transform: translateY(-4px) scaleY(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scaleY(1);
    }
  }
  .animate-menu-open {
    animation: menu-open 160ms ease-out;
    transform-origin: top;
  }
</style>