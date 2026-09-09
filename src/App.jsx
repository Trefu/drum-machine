import { useEffect, useState } from "react";
import { Display } from "./components/Display";
import { Drumpads } from "./containers/DrumPads";
import SOUND_BANKS from "./data/soundBanks";

function App() {
  const [power, setPower] = useState(true);
  const [actualSound, setActualSound] = useState('—');
  const [volume, setVolume] = useState(0.4);
  const [bankIndex, setBankIndex] = useState(0);

  const bank = SOUND_BANKS[bankIndex];

  useEffect(() => {
    setActualSound('—');
  }, [bankIndex]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(circle at 20% 10%, rgba(34,197,94,0.15), transparent 40%), radial-gradient(circle at 80% 90%, rgba(56,189,248,0.18), transparent 45%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <header className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={[
                'h-3 w-3 rounded-full transition-all duration-300',
                power ? bank.ledClass : 'bg-slate-700',
              ].join(' ')}
            />
            <h1 className="text-white font-extrabold tracking-[0.3em] text-sm md:text-base">
              NEON·DRUM MP-09
            </h1>
          </div>
        </header>

        <div
          id="drum-machine"
          className="flex flex-col md:flex-row gap-5 md:gap-6 p-5 md:p-7 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-950 border border-slate-700/80 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
        >
          <Drumpads
            volume={volume}
            power={power}
            sounds={bank.sounds}
            accentClass={bank.accent}
            ledClass={bank.led}
            setActualSound={setActualSound}
          />
          <Display
            volume={volume}
            setVolume={setVolume}
            power={power}
            setPower={setPower}
            actualSound={actualSound}
            banks={SOUND_BANKS}
            bankIndex={bankIndex}
            setBankIndex={setBankIndex}
            ledClass={bank.led}
          />
        </div>

        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
          {bank.name} · {bank.subtitle}
        </p>
      </div>
    </div>
  );
}

export default App;