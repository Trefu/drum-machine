<script>
  export let volume;
  export let setVolume;
  export let power;
  export let setPower;
  export let actualSound;
  export let banks;
  export let bankIndex;
  export let setBankIndex;
  export let ledClass;

  function handleRange(e) {
    setVolume(parseFloat(e.target.value));
  }

  function handlePower() {
    setPower(!power);
  }

  function handleBank() {
    if (!power) return;
    setBankIndex((bankIndex + 1) % banks.length);
  }

  $: volPct = Math.round(volume * 100);
  $: ledColor = banks[bankIndex].led.includes('amber') ? 'bg-amber-400' : 'bg-cyan-400';
</script>

<div
  id="display"
  class="w-72 md:w-80 shrink-0 flex flex-col gap-4 p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_20px_40px_-12px_rgba(0,0,0,0.7)]"
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
    <span class="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-semibold">MP-09</span>
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
          class="mt-1 font-mono text-2xl md:text-3xl font-bold text-emerald-300 animate-lcd-flash"
          style="text-shadow: 0 0 6px rgba(110,231,183,0.7), 0 0 14px rgba(110,231,183,0.35);"
        >
          {power && actualSound !== '—' ? actualSound : '—'}
        </span>
      {/key}
    </div>
  </div>

  <button
    on:click={handleBank}
    disabled={!power}
    class="group relative overflow-hidden rounded-xl px-4 py-3 text-left bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/70 shadow-[0_3px_0_0_rgba(15,23,42,0.9)] transition-all duration-150"
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
    <span class="mt-0.5 flex items-baseline justify-between">
      <span class="text-base font-bold text-white">{banks[bankIndex].name}</span>
      <span class="text-[10px] font-mono text-slate-400">
        {String(bankIndex + 1).padStart(2, '0')}/{String(banks.length).padStart(2, '0')}
      </span>
    </span>
    <span class="block text-[11px] text-slate-400 mt-0.5">
      {banks[bankIndex].subtitle}
    </span>
    <span
      class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-slate-300 transition-colors"
    >
      ↻
    </span>
  </button>

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
  .shadow-led {
    box-shadow: 0 0 12px 2px currentColor;
  }
  .shadow-led.bg-amber-400 {
    color: rgba(251, 191, 36, 0.9);
  }
  .shadow-led.bg-cyan-400 {
    color: rgba(34, 211, 238, 0.9);
  }
  .shadow-power {
    box-shadow: 0 0 18px 2px rgba(16, 185, 129, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }
</style>