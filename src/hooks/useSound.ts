import { useCallback, useRef } from 'react';

export type SoundType =
  | 'timer'
  | 'correct'
  | 'incorrect'
  | 'select'
  | 'timeup'
  | 'lifeline'
  | 'celebration'
  | 'intro'
  | 'whoosh'
  | 'suspense';

const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const suspenseTimerRef = useRef<number | null>(null);
  const suspenseStoppedRef = useRef(true);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.3,
    delay = 0
  ) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch {
      // Audio not supported
    }
  }, [getCtx]);

  const playChord = useCallback((
    frequencies: number[],
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.15,
    delay = 0
  ) => {
    frequencies.forEach(freq => playTone(freq, duration, type, volume, delay));
  }, [playTone]);

  const stopSuspense = useCallback(() => {
    suspenseStoppedRef.current = true;
    if (suspenseTimerRef.current !== null) {
      clearTimeout(suspenseTimerRef.current);
      suspenseTimerRef.current = null;
    }
  }, []);

  const playSound = useCallback((sound: SoundType) => {
    switch (sound) {
      // Tick del timer - pulso tenso
      case 'timer': {
        playTone(880, 0.06, 'sine', 0.12);
        playTone(440, 0.06, 'square', 0.05, 0.06);
        break;
      }

      // Respuesta correcta - fanfarria ascendente con acordes
      case 'correct': {
        playChord([523, 659, 784], 0.2, 'sine', 0.15);
        playChord([587, 740, 880], 0.2, 'sine', 0.15, 0.15);
        playChord([659, 831, 988], 0.4, 'sine', 0.18, 0.3);
        playTone(1318, 0.3, 'sine', 0.08, 0.35);
        playChord([784, 988, 1175], 0.6, 'triangle', 0.1, 0.5);
        break;
      }

      // Respuesta incorrecta - sonido grave descendente dramático
      case 'incorrect': {
        playChord([200, 250], 0.4, 'sawtooth', 0.12);
        playChord([150, 190], 0.5, 'sawtooth', 0.1, 0.35);
        playTone(100, 0.8, 'sine', 0.15, 0.6);
        break;
      }

      // Selección de respuesta - "lock in" dramático
      case 'select': {
        playTone(600, 0.08, 'sine', 0.2);
        playTone(800, 0.08, 'sine', 0.2, 0.08);
        playTone(600, 0.15, 'triangle', 0.12, 0.16);
        playTone(800, 0.3, 'sine', 0.05, 0.25);
        break;
      }

      // Tiempo agotado - alarma dramática
      case 'timeup': {
        for (let i = 0; i < 3; i++) {
          playTone(880, 0.12, 'square', 0.15, i * 0.18);
        }
        playChord([220, 277], 0.8, 'sawtooth', 0.1, 0.55);
        playTone(110, 1.0, 'sine', 0.12, 0.8);
        break;
      }

      // Uso de ayuda/lifeline - sonido misterioso
      case 'lifeline': {
        const lifelineNotes = [392, 466, 523, 622, 698];
        lifelineNotes.forEach((freq, i) => {
          playTone(freq, 0.25, 'sine', 0.12, i * 0.08);
        });
        playChord([698, 880], 0.5, 'triangle', 0.08, 0.45);
        break;
      }

      // Celebración / resultados - fanfarria completa
      case 'celebration': {
        playChord([261, 329, 392], 0.25, 'sine', 0.12);
        playChord([329, 415, 493], 0.25, 'sine', 0.12, 0.25);
        playChord([392, 493, 587], 0.3, 'sine', 0.15, 0.5);
        playChord([523, 659, 784, 1046], 0.8, 'sine', 0.12, 0.8);
        playChord([523, 659, 784, 1046], 0.8, 'triangle', 0.06, 0.85);
        playTone(1568, 0.5, 'sine', 0.06, 1.0);
        playTone(2093, 0.4, 'sine', 0.03, 1.1);
        break;
      }

      // Intro del juego - apertura épica
      case 'intro': {
        playTone(65, 0.6, 'sine', 0.2);
        playTone(130, 0.5, 'triangle', 0.1);
        const introNotes = [261, 329, 392, 523];
        introNotes.forEach((freq, i) => {
          playTone(freq, 0.2, 'sine', 0.1, 0.2 + i * 0.12);
        });
        playChord([523, 659, 784], 0.7, 'sine', 0.12, 0.75);
        playTone(1046, 0.5, 'sine', 0.06, 0.85);
        break;
      }

      // Transición whoosh - entre preguntas
      case 'whoosh': {
        try {
          const ctx = getCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(200, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
          osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.4);
        } catch { /* not supported */ }
        break;
      }

      // Suspenso - tic-tac de reloj que acelera (se detiene con stopSuspense)
      case 'suspense': {
        stopSuspense();
        suspenseStoppedRef.current = false;

        let tickCount = 0;
        const maxTicks = 40;

        const scheduleTick = () => {
          if (suspenseStoppedRef.current || tickCount >= maxTicks) return;

          // Alternar entre "tic" (agudo) y "tac" (grave)
          const isTic = tickCount % 2 === 0;
          const freq = isTic ? 1200 : 800;
          const vol = 0.07 + tickCount * 0.003;

          playTone(freq, 0.06, 'sine', Math.min(vol, 0.18));

          tickCount++;
          // Intervalo se acorta: de 800ms al inicio hasta 300ms al final
          const progress = tickCount / maxTicks;
          const interval = 800 - progress * 500;
          suspenseTimerRef.current = window.setTimeout(scheduleTick, interval);
        };

        scheduleTick();
        break;
      }
    }
  }, [playTone, playChord, getCtx, stopSuspense]);

  return { playSound, stopSuspense };
}
