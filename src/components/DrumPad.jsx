import { useEffect, useRef, useState, useCallback } from "react";

export const DrumPad = ({ volume, power, sound, accentClass, ledClass, onPlay }) => {
  const audioRef = useRef(null);
  const [active, setActive] = useState(false);

  const trigger = useCallback(() => {
    if (!power) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => {});
    setActive(true);
    onPlay(sound.id);
    window.setTimeout(() => setActive(false), 160);
  }, [power, volume, sound.id, onPlay]);

  const handleClick = () => trigger();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.keyCode === sound.keyCode) {
        e.preventDefault();
        trigger();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [trigger, sound.keyCode]);

  const disabled = !power;
  const ringColor = accentClass.replace('from-', 'via-').split(' ')[0];

  return (
    <button
      onClick={handleClick}
      id={sound.id}
      disabled={disabled}
      className={[
        'group relative drum-pad',
        'aspect-square rounded-2xl',
        'flex flex-col items-center justify-center',
        'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900',
        'border border-slate-600/80',
        'shadow-[0_6px_0_0_rgba(15,23,42,0.9),0_12px_24px_-6px_rgba(0,0,0,0.6)]',
        'transition-all duration-100 ease-out',
        'select-none',
        active
          ? `translate-y-[2px] scale-[0.97] shadow-[0_2px_0_0_rgba(15,23,42,0.9),0_0_0_2px_rgba(255,255,255,0.15)_inset] border-transparent bg-gradient-to-br ${accentClass}`
          : 'hover:-translate-y-[2px] hover:shadow-[0_8px_0_0_rgba(15,23,42,0.9),0_18px_28px_-6px_rgba(0,0,0,0.7)]',
        disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
      style={
        active
          ? {
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.25) inset, 0 0 24px 0 rgba(255,255,255,0.15), 0 2px 0 0 rgba(15,23,42,0.9)',
            }
          : undefined
      }
    >
      <span
        className={[
          'pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-150',
          active ? 'opacity-100' : 'group-hover:opacity-40',
        ].join(' ')}
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.18), transparent 60%)',
        }}
      />

      <span
        className={[
          'pointer-events-none absolute top-2 right-2 h-2.5 w-2.5 rounded-full transition-all duration-150',
          active
            ? `${ledClass} scale-110`
            : 'bg-slate-500/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]',
        ].join(' ')}
      />

      <span
        className={[
          'relative font-mono font-extrabold text-3xl md:text-4xl',
          'transition-colors duration-150',
          active ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'text-slate-200 group-hover:text-white',
        ].join(' ')}
      >
        {sound.keyTrigger}
      </span>

      <span
        className={[
          'relative mt-1 text-[10px] md:text-xs uppercase tracking-[0.18em] font-semibold',
          'transition-colors duration-150',
          active ? 'text-white/90' : 'text-slate-400 group-hover:text-slate-300',
        ].join(' ')}
      >
        {sound.id}
      </span>

      <audio
        ref={audioRef}
        preload="auto"
        id={`${sound.keyTrigger}`}
        className="clip hidden"
        src={sound.url}
      ></audio>
    </button>
  );
};