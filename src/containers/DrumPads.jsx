import { DrumPad } from "../components/DrumPad";

export const Drumpads = ({ volume, power, sounds, accentClass, ledClass, setActualSound }) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_20px_40px_-12px_rgba(0,0,0,0.7)]">
        {sounds.map((s) => (
          <DrumPad
            key={`${s.id}-${s.keyCode}`}
            volume={volume}
            power={power}
            sound={s}
            accentClass={accentClass}
            ledClass={ledClass}
            onPlay={setActualSound}
          />
        ))}
      </div>
      <div className="mt-3 mx-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-slate-500 font-semibold">
        <span>Use Q W E · A S D · Z X C</span>
        <span>9 Pads</span>
      </div>
    </div>
  );
};