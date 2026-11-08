"use client";

import { useEffect, useRef, useState } from "react";
import { SoundOffIcon, SoundOnIcon } from "./Icons";

/**
 * Site-wide audio, synthesized with the Web Audio API (no audio files to load):
 * - Calm, continuous ambient music (soft pad chords + occasional gentle bell notes).
 * - Soft metallic "ting" when clicking links/buttons, faint tick on hover.
 *
 * Browsers only allow sound after the visitor interacts with the page, so the music
 * starts on the first click / tap / key press. One floating button mutes everything,
 * and the choice is remembered.
 */

const STORAGE_KEY = "zetrix-sound-v2"; // v2: default changed to off
const HOVER_SELECTOR = "header a, a.rounded-full, button";
const MUSIC_VOLUME = 0.16;

// Am9 – Fmaj7 – Cmaj7 – G6 (frequencies in Hz), each chord ~9 s
const CHORDS = [
  [110.0, 164.81, 196.0, 246.94, 261.63],
  [87.31, 130.81, 174.61, 220.0, 261.63],
  [130.81, 164.81, 196.0, 246.94, 293.66],
  [98.0, 146.83, 196.0, 246.94, 329.63],
];
const BELL_NOTES = [440, 523.25, 587.33, 659.25, 783.99, 880];
const CHORD_SECONDS = 9;

type Engine = {
  ctx: AudioContext;
  fx: GainNode; // sound effects bus
  music: GainNode; // music bus
  musicIn: AudioNode;
  timers: number[];
  started: boolean;
};

function makeReverb(ctx: AudioContext, seconds = 4) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

export default function SoundFX({ labels }: { labels: { soundOn: string; soundOff: string } }) {
  // sound is off until the visitor turns it on (remembered in this browser)
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const enabledRef = useRef(false);
  const engineRef = useRef<Engine | null>(null);
  const lastHover = useRef<Element | null>(null);
  const lastHoverTime = useRef(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "on") {
        setEnabled(true);
        enabledRef.current = true;
      }
    } catch {}
  }, []);

  useEffect(() => {
    const getEngine = () => {
      if (!engineRef.current) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        const ctx = new AC();
        const master = ctx.createGain();
        master.gain.value = 1;
        master.connect(ctx.destination);

        const fx = ctx.createGain();
        fx.gain.value = 1;
        fx.connect(master);

        const music = ctx.createGain();
        music.gain.value = 0;
        music.connect(master);

        // music chain: soft low-pass -> dry + long reverb
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 1100;
        lp.Q.value = 0.4;
        const dry = ctx.createGain();
        dry.gain.value = 0.55;
        const wet = ctx.createGain();
        wet.gain.value = 0.7;
        const rev = makeReverb(ctx);
        lp.connect(dry).connect(music);
        lp.connect(rev).connect(wet).connect(music);

        engineRef.current = { ctx, fx, music, musicIn: lp, timers: [], started: false };
      }
      const e = engineRef.current;
      if (e.ctx.state === "suspended") e.ctx.resume();
      return e;
    };

    const tone = (e: Engine, freq: number, start: number, dur: number, peak: number) => {
      const osc = e.ctx.createOscillator();
      const gain = e.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain).connect(e.fx);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    };

    // ---------- ambient music ----------
    const playChord = (e: Engine, chord: number[], at: number) => {
      const len = CHORD_SECONDS + 4; // overlap for smooth crossfade
      chord.forEach((f, i) => {
        [-4, 4].forEach((detune) => {
          const osc = e.ctx.createOscillator();
          const g = e.ctx.createGain();
          osc.type = i === 0 ? "sine" : "triangle";
          osc.frequency.value = f;
          osc.detune.value = detune;
          const peak = (i === 0 ? 0.09 : 0.05) / 2;
          g.gain.setValueAtTime(0.0001, at);
          g.gain.linearRampToValueAtTime(peak, at + 3.5);
          g.gain.setValueAtTime(peak, at + len - 4.5);
          g.gain.linearRampToValueAtTime(0.0001, at + len);
          osc.connect(g).connect(e.musicIn);
          osc.start(at);
          osc.stop(at + len + 0.1);
        });
      });
    };

    const playBell = (e: Engine, at: number) => {
      const f = BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)];
      const osc = e.ctx.createOscillator();
      const g = e.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(0.035, at + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 3.5);
      osc.connect(g).connect(e.musicIn);
      osc.start(at);
      osc.stop(at + 3.6);
    };

    const startMusic = () => {
      const e = getEngine();
      if (!e || e.started) return;
      e.started = true;
      let step = 0;
      const schedule = () => {
        if (document.hidden) return; // pause scheduling in background tabs
        const now = e.ctx.currentTime + 0.05;
        playChord(e, CHORDS[step % CHORDS.length], now);
        const bells = 1 + Math.floor(Math.random() * 2);
        for (let b = 0; b < bells; b++) playBell(e, now + 1.5 + Math.random() * (CHORD_SECONDS - 3));
        step++;
      };
      schedule();
      e.timers.push(window.setInterval(schedule, CHORD_SECONDS * 1000));
      setPlaying(true);
    };

    const fadeMusic = (on: boolean) => {
      const e = engineRef.current;
      if (!e) return;
      const t = e.ctx.currentTime;
      e.music.gain.cancelScheduledValues(t);
      e.music.gain.setValueAtTime(e.music.gain.value, t);
      e.music.gain.linearRampToValueAtTime(on ? MUSIC_VOLUME : 0, t + (on ? 2.5 : 0.6));
    };

    // ---------- UI effects ----------
    const playClick = () => {
      if (!enabledRef.current) return;
      const e = getEngine();
      if (!e) return;
      const t = e.ctx.currentTime;
      tone(e, 1320, t, 0.32, 0.05);
      tone(e, 1999, t, 0.22, 0.022);
      tone(e, 3560, t, 0.12, 0.01);
    };

    const playHover = () => {
      const e = engineRef.current;
      if (!enabledRef.current || !e || e.ctx.state !== "running") return;
      tone(e, 2400, e.ctx.currentTime, 0.05, 0.008);
    };

    // first real interaction unlocks audio and starts the music
    const unlock = () => {
      if (!enabledRef.current) return;
      startMusic();
      fadeMusic(true);
      removeUnlock();
    };
    const unlockEvents = ["pointerdown", "keydown", "touchend"] as const;
    const removeUnlock = () => unlockEvents.forEach((ev) => document.removeEventListener(ev, unlock));
    unlockEvents.forEach((ev) => document.addEventListener(ev, unlock));

    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as Element | null)?.closest?.("a, button");
      if (el && !el.hasAttribute("data-no-sound")) playClick();
    };

    const onOver = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse") return;
      const el = (ev.target as Element | null)?.closest?.(HOVER_SELECTOR);
      if (!el || el === lastHover.current) return;
      lastHover.current = el;
      const now = performance.now();
      if (now - lastHoverTime.current < 90) return;
      lastHoverTime.current = now;
      playHover();
    };
    const onOut = (ev: PointerEvent) => {
      const el = (ev.target as Element | null)?.closest?.(HOVER_SELECTOR);
      if (el && el === lastHover.current && !el.contains(ev.relatedTarget as Node | null)) {
        lastHover.current = null;
      }
    };

    const onVisibility = () => {
      const e = engineRef.current;
      if (!e) return;
      if (document.hidden) e.ctx.suspend();
      else if (enabledRef.current) e.ctx.resume();
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("visibilitychange", onVisibility);
    // pause the ambient music while a video with its own sound is playing
    const onMedia = (ev: Event) => {
      if (!enabledRef.current || !engineRef.current) return;
      fadeMusic(Boolean((ev as CustomEvent<boolean>).detail));
    };
    window.addEventListener("zetrix-music", onMedia);

    const w = window as unknown as { __zetrixAudio?: (on: boolean) => void };
    w.__zetrixAudio = (on: boolean) => {
      if (on) {
        startMusic();
        fadeMusic(true);
        playClick();
      } else {
        fadeMusic(false);
      }
    };

    return () => {
      removeUnlock();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("zetrix-music", onMedia);
      engineRef.current?.timers.forEach((id) => clearInterval(id));
      engineRef.current?.ctx.close();
      engineRef.current = null;
    };
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    enabledRef.current = next;
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {}
    (window as unknown as { __zetrixAudio?: (on: boolean) => void }).__zetrixAudio?.(next);
  };

  const label = enabled ? labels.soundOff : labels.soundOn;
  const active = enabled && playing;

  return (
    <button
      type="button"
      data-no-sound
      onClick={toggle}
      aria-label={label}
      aria-pressed={enabled}
      title={label}
      className="fixed bottom-5 start-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-gold-400/40 bg-navy-950/90 text-gold-400 shadow-lg backdrop-blur transition-colors hover:bg-navy-800"
    >
      {active && <span className="sound-ring absolute inset-0 rounded-full border border-gold-400/60" />}
      {enabled ? <SoundOnIcon className="h-5 w-5" /> : <SoundOffIcon className="h-5 w-5" />}
    </button>
  );
}
