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
  | 'suspense'
  | 'drumroll'
  | 'reveal';

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

  // Play a note with vibrato for richer sound
  const playRichTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.15,
    delay = 0
  ) => {
    try {
      const ctx = getCtx();

      // Main oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Vibrato LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5;
      lfoGain.gain.value = frequency * 0.01;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gain.gain.setValueAtTime(volume, ctx.currentTime + delay + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
      lfo.start(ctx.currentTime + delay);
      lfo.stop(ctx.currentTime + delay + duration);
    } catch {
      // Audio not supported
    }
  }, [getCtx]);

  // Noise burst for impact
  const playNoiseBurst = useCallback((duration: number, volume = 0.05, delay = 0) => {
    try {
      const ctx = getCtx();
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // Decaying noise
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(ctx.currentTime + delay);
    } catch {
      // Audio not supported
    }
  }, [getCtx]);

  const stopSuspense = useCallback(() => {
    suspenseStoppedRef.current = true;
    if (suspenseTimerRef.current !== null) {
      clearTimeout(suspenseTimerRef.current);
      suspenseTimerRef.current = null;
    }
  }, []);

  const playSound = useCallback((sound: SoundType) => {
    switch (sound) {
      // Timer tick - more dramatic with sub-bass
      case 'timer': {
        playTone(880, 0.06, 'sine', 0.12);
        playTone(440, 0.06, 'square', 0.04, 0.06);
        playTone(110, 0.1, 'sine', 0.06); // Sub bass thump
        break;
      }

      // Correct answer - rich triumphant fanfare
      case 'correct': {
        playNoiseBurst(0.15, 0.03); // Impact
        playChord([523, 659, 784], 0.25, 'sine', 0.15);
        playRichTone(659, 0.2, 'sine', 0.12, 0.1);
        playChord([587, 740, 880], 0.25, 'sine', 0.15, 0.2);
        playChord([659, 831, 988], 0.4, 'sine', 0.18, 0.35);
        playRichTone(1318, 0.35, 'sine', 0.08, 0.4);
        playChord([784, 988, 1175], 0.7, 'triangle', 0.1, 0.55);
        playRichTone(1568, 0.5, 'sine', 0.06, 0.7);
        break;
      }

      // Incorrect - dramatic descending with impact
      case 'incorrect': {
        playNoiseBurst(0.2, 0.04); // Impact
        playChord([200, 250], 0.5, 'sawtooth', 0.1);
        playChord([150, 190], 0.6, 'sawtooth', 0.08, 0.4);
        playTone(80, 1.0, 'sine', 0.15, 0.7);
        playTone(60, 1.2, 'sine', 0.08, 0.8);
        break;
      }

      // Select - dramatic "lock in" with rising tension
      case 'select': {
        playTone(500, 0.08, 'sine', 0.15);
        playTone(700, 0.08, 'sine', 0.18, 0.08);
        playTone(900, 0.1, 'sine', 0.12, 0.16);
        playChord([700, 1050], 0.4, 'triangle', 0.06, 0.26);
        playNoiseBurst(0.1, 0.02, 0.08);
        break;
      }

      // Time up - urgent alarm with bass rumble
      case 'timeup': {
        for (let i = 0; i < 4; i++) {
          playTone(880, 0.1, 'square', 0.12, i * 0.15);
        }
        playChord([220, 277], 0.8, 'sawtooth', 0.08, 0.6);
        playTone(80, 1.2, 'sine', 0.12, 0.7);
        playNoiseBurst(0.3, 0.04, 0.6);
        break;
      }

      // Lifeline - mystical ascending with shimmer
      case 'lifeline': {
        const lifelineNotes = [392, 466, 523, 622, 698, 784];
        lifelineNotes.forEach((freq, i) => {
          playRichTone(freq, 0.3, 'sine', 0.1, i * 0.08);
        });
        playChord([698, 880, 1047], 0.6, 'triangle', 0.06, 0.5);
        break;
      }

      // Celebration - epic victorious fanfare with layers
      case 'celebration': {
        // Bass foundation
        playTone(65, 1.5, 'sine', 0.12);
        playTone(130, 1.2, 'triangle', 0.06, 0.1);

        // Main fanfare
        playChord([261, 329, 392], 0.3, 'sine', 0.12, 0.1);
        playChord([329, 415, 493], 0.3, 'sine', 0.12, 0.35);
        playChord([392, 493, 587], 0.35, 'sine', 0.15, 0.6);
        playChord([523, 659, 784, 1046], 0.9, 'sine', 0.12, 0.9);

        // Shimmer top notes
        playRichTone(1568, 0.6, 'sine', 0.05, 1.0);
        playRichTone(2093, 0.5, 'sine', 0.03, 1.15);

        // Noise shimmer
        playNoiseBurst(0.2, 0.02, 0.9);

        // Final sustain chord
        playChord([523, 659, 784, 1046], 1.2, 'triangle', 0.05, 1.3);
        break;
      }

      // Intro - epic cinematic opening
      case 'intro': {
        // Deep bass rumble
        playTone(40, 1.0, 'sine', 0.15);
        playTone(65, 0.8, 'sine', 0.12, 0.1);
        playNoiseBurst(0.3, 0.03);

        // Rising scale
        const introNotes = [261, 329, 392, 523, 659];
        introNotes.forEach((freq, i) => {
          playRichTone(freq, 0.25, 'sine', 0.08, 0.3 + i * 0.1);
        });

        // Climax chord
        playChord([523, 659, 784, 1046], 0.8, 'sine', 0.12, 0.85);
        playRichTone(1046, 0.6, 'sine', 0.05, 0.95);
        break;
      }

      // Whoosh - cinematic sweep
      case 'whoosh': {
        try {
          const ctx = getCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.12);
          osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.4);
        } catch { /* not supported */ }
        playNoiseBurst(0.15, 0.03);
        break;
      }

      // Suspense - accelerating clock tick
      case 'suspense': {
        stopSuspense();
        suspenseStoppedRef.current = false;

        let tickCount = 0;
        const maxTicks = 45;

        const scheduleTick = () => {
          if (suspenseStoppedRef.current || tickCount >= maxTicks) return;

          const isTic = tickCount % 2 === 0;
          const freq = isTic ? 1200 : 800;
          const vol = 0.06 + tickCount * 0.003;

          playTone(freq, 0.05, 'sine', Math.min(vol, 0.18));
          // Add sub-bass for later ticks
          if (tickCount > 20) {
            playTone(60, 0.08, 'sine', 0.04);
          }

          tickCount++;
          const progress = tickCount / maxTicks;
          const interval = 800 - progress * 550;
          suspenseTimerRef.current = window.setTimeout(scheduleTick, interval);
        };

        scheduleTick();
        break;
      }

      // Drum roll for dramatic reveal
      case 'drumroll': {
        for (let i = 0; i < 20; i++) {
          const progress = i / 20;
          const interval = 120 - progress * 60;
          playTone(200, 0.05, 'triangle', 0.08 + progress * 0.04, i * interval / 1000);
          playNoiseBurst(0.03, 0.02, i * interval / 1000);
        }
        break;
      }

      // Reveal scanning sound
      case 'reveal': {
        playTone(600, 0.15, 'sine', 0.1);
        playTone(800, 0.1, 'sine', 0.08, 0.05);
        break;
      }
    }
  }, [playTone, playChord, playRichTone, playNoiseBurst, getCtx, stopSuspense]);

  return { playSound, stopSuspense };
}
