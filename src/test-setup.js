import '@testing-library/jest-dom/vitest';

class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.state = 'running';
    this.destination = {};
  }
  resume() {
    return Promise.resolve();
  }
  createGain() {
    return {
      gain: { value: 0, setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      connect: () => this.createGain(),
    };
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 0, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      detune: { value: 0 },
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { value: 0, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      Q: { value: 0 },
      connect: () => {},
    };
  }
  createBufferSource() {
    return {
      buffer: null,
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  createBuffer() {
    return {
      getChannelData: () => new Float32Array(100),
    };
  }
  sampleRate = 44100;
}

window.AudioContext = MockAudioContext;
window.webkitAudioContext = MockAudioContext;

window.HTMLMediaElement.prototype.play = function () {
  return Promise.resolve();
};
window.HTMLMediaElement.prototype.pause = function () {};
window.HTMLMediaElement.prototype.load = function () {};

window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};