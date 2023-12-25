// import { Component, JSX, createContext, createSignal } from "solid-js";

import { useContext } from "react";

export const GlobalAudioContext = useContext<GlobalAudioContextState>();

export const GlobalAudioContextProvider: React.FC<{
  children: JSX.Element | JSX.Element[],
}> = (props) => {

  const audioContext = new AudioContext();
  const oscillator = new OscillatorNode(audioContext);
  const synthVocal = audioContext.createBuffer(
    1,
    audioContext.sampleRate * 3,
    audioContext.sampleRate,
  );
  oscillator.type = 'sine';

  const [audioContextState, setAudioContextState] = createSignal<GlobalAudioContextState>({
    audioContext: audioContext,
    oscillator: oscillator,
  });

  audioContextState().oscillator.type = 'sine';
  audioContextState().oscillator.connect(audioContextState().audioContext.destination);

  return (
    <GlobalAudioContext.Provider value={audioContextState()}>
      <audio hidden />
      {props.children}
    </GlobalAudioContext.Provider>
  );
};

export type GlobalAudioContextState = {
  audioContext: AudioContext,
  oscillator: OscillatorNode,
}

function createLowShelfFilterNode(audioCtx: AudioContext) {
  const lowBand = audioCtx.createBiquadFilter();
  lowBand.type = 'lowshelf';
  lowBand.frequency.value = 320;
  lowBand.gain.value = 0;
  return lowBand;
}

function createBellFilterNode(audioCtx: AudioContext) {
  const midBand = audioCtx.createBiquadFilter();
  midBand.type = 'peaking';
  midBand.Q.value = 1;
  midBand.frequency.value = 1000; // Mid frequency
  midBand.gain.value = 0;
  return midBand;
}

function createHighShelfFilterNode(audioCtx: AudioContext) {
  const highBand = audioCtx.createBiquadFilter();
  highBand.type = 'highshelf';
  highBand.frequency.value = 3200;
  highBand.gain.value = 0;
  return highBand;
}

function createConvReverbNode(audioCtx: AudioContext, impulseResponsePath: string) {
  const convolver = audioCtx.createConvolver();

  fetch(impulseResponsePath)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      convolver.buffer = audioBuffer;
    });

  return convolver;
}
