<script>
  import SurprisePad from './SurprisePad.svelte';

  export let volume;
  export let power;
  export let sounds;
  export let accentClass;
  export let setActualSound;
</script>

<div class="relative w-full min-w-0">
  <div
    class="grid grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-6 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_20px_40px_-12px_rgba(0,0,0,0.7)]"
  >
    {#each sounds as s (s.id + s.keyCode)}
      <SurprisePad
        volume={volume}
        power={power}
        sound={s}
        accentClass={accentClass}
        onPlay={setActualSound}
      />
    {/each}
  </div>
  <div class="mt-2.5 md:mt-3 mx-1 flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-slate-500 font-semibold">
    <span class="truncate">Q W E · A S D · Z X C</span>
    <span class="shrink-0 ml-2">9 Pads</span>
  </div>
</div>