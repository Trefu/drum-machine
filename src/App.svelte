<script>
  import SOUND_BANKS from './lib/soundBanks.js';
  import Drumpads from './lib/DrumPads.svelte';
  import Display from './lib/Display.svelte';

  let power = true;
  let actualSound = '—';
  let volume = 0.4;
  let bankIndex = 0;

  $: bank = SOUND_BANKS[bankIndex];

  $: if (bank) {
    actualSound = '—';
  }
</script>

<div class="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-slate-950">
  <div
    class="pointer-events-none absolute inset-0 opacity-50"
    style="background: radial-gradient(circle at 20% 10%, rgba(34,197,94,0.15), transparent 40%), radial-gradient(circle at 80% 90%, rgba(56,189,248,0.18), transparent 45%);"
  ></div>
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.04]"
    style="background-image: linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px); background-size: 32px 32px;"
  ></div>

  <div class="relative z-10 flex flex-col items-center gap-4">
    <header class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span
          class="h-3 w-3 rounded-full transition-all duration-300 bg-slate-700"
          class:bg-amber-400={power && bank.id === 'heater'}
          class:shadow-[0_0_12px_2px_rgba(251,191,36,0.85)]={power && bank.id === 'heater'}
          class:bg-cyan-400={power && bank.id === 'piano'}
          class:shadow-[0_0_12px_2px_rgba(34,211,238,0.85)]={power && bank.id === 'piano'}
        ></span>
        <h1 class="text-white font-extrabold tracking-[0.3em] text-sm md:text-base">
          NEON·DRUM MP-09
        </h1>
      </div>
    </header>

    <div
      id="drum-machine"
      class="flex flex-col md:flex-row gap-5 md:gap-6 p-5 md:p-7 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-950 border border-slate-700/80 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
    >
      <Drumpads
        volume={volume}
        power={power}
        sounds={bank.sounds}
        accentClass={bank.accent}
        ledClass={bank.led}
        setActualSound={(v) => (actualSound = v)}
      />
      <Display
        volume={volume}
        setVolume={(v) => (volume = v)}
        power={power}
        setPower={(v) => (power = v)}
        actualSound={actualSound}
        banks={SOUND_BANKS}
        bankIndex={bankIndex}
        setBankIndex={(v) => (bankIndex = v)}
        ledClass={bank.led}
      />
    </div>

    <p class="text-[11px] uppercase tracking-[0.3em] text-slate-500">
      {bank.name} · {bank.subtitle}
    </p>
  </div>
</div>