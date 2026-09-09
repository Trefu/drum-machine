export const Display = ({
  volume,
  setVolume,
  power,
  setPower,
  actualSound,
  banks,
  bankIndex,
  setBankIndex,
  ledClass,
}) => {
  const handleRangeChange = (e) => setVolume(parseFloat(e.target.value));
  const handlePower = () => setPower(!power);
  const handleBank = () => {
    if (!power) return;
    setBankIndex((bankIndex + 1) % banks.length);
  };

  const volPct = Math.round(volume * 100);

  return (
    <div
      id="display"
      className="w-72 md:w-80 shrink-0 flex flex-col gap-4 p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_20px_40px_-12px_rgba(0,0,0,0.7)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={[
              'h-2.5 w-2.5 rounded-full transition-all duration-200',
              power
                ? ledClass
                : 'bg-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]',
            ].join(' ')}
          />
          <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
            {power ? 'Power On' : 'Power Off'}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-semibold">
          MP-09
        </span>
      </div>

      <div
        className={[
          'relative rounded-xl overflow-hidden',
          'bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950',
          'border border-emerald-800/60',
          'shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]',
          'transition-opacity duration-300',
          power ? 'opacity-100' : 'opacity-40',
        ].join(' ')}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
          }}
        />
        <div className="relative px-4 py-5 min-h-[96px] flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400/70 font-mono">
            Now Playing
          </span>
          <span
            key={actualSound}
            className="mt-1 font-mono text-2xl md:text-3xl font-bold text-emerald-300 animate-lcd-flash"
            style={{
              textShadow:
                '0 0 6px rgba(110,231,183,0.7), 0 0 14px rgba(110,231,183,0.35)',
            }}
          >
            {power && actualSound !== '—' ? actualSound : '—'}
          </span>
        </div>
      </div>

      <button
        onClick={handleBank}
        disabled={!power}
        className={[
          'group relative overflow-hidden rounded-xl px-4 py-3 text-left',
          'bg-gradient-to-br from-slate-700 to-slate-800',
          'border border-slate-600/70',
          'shadow-[0_3px_0_0_rgba(15,23,42,0.9)]',
          'transition-all duration-150',
          power
            ? 'hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer'
            : 'opacity-50 cursor-not-allowed',
        ].join(' ')}
      >
        <span className="block text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
          Sound Bank
        </span>
        <span className="mt-0.5 flex items-baseline justify-between">
          <span className="text-base font-bold text-white">
            {banks[bankIndex].name}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {String(bankIndex + 1).padStart(2, '0')}/{String(banks.length).padStart(2, '0')}
          </span>
        </span>
        <span className="block text-[11px] text-slate-400 mt-0.5">
          {banks[bankIndex].subtitle}
        </span>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-slate-300 transition-colors">
          ↻
        </span>
      </button>

      <div className="rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/70 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
            Volume
          </span>
          <span className="font-mono text-sm text-white tabular-nums">
            {volPct}
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-slate-900 overflow-hidden mb-3 border border-slate-700">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 transition-all duration-150"
            style={{ width: `${volPct}%` }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 8px)',
            }}
          />
        </div>
        <input
          aria-label="Volume"
          max="1"
          min="0"
          step="0.01"
          type="range"
          value={volume}
          onChange={handleRangeChange}
          className="volume-slider w-full accent-emerald-400"
        />
      </div>

      <button
        onClick={handlePower}
        className={[
          'relative h-12 rounded-xl font-bold text-sm uppercase tracking-[0.2em]',
          'border transition-all duration-200',
          power
            ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-400/60 text-white shadow-[0_0_18px_2px_rgba(16,185,129,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]'
            : 'bg-gradient-to-b from-slate-700 to-slate-800 border-slate-600 text-slate-300',
        ].join(' ')}
      >
        {power ? 'Power · On' : 'Power · Off'}
      </button>
    </div>
  );
};