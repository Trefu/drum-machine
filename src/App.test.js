import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import App from './App.svelte';
import SOUND_BANKS from './lib/soundBanks.js';

const HEATER_KEYS = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
const HEATER_IDS = [
  'Heater-1', 'Heater-2', 'Heater-3', 'Heater-4',
  'Clap', 'Open-HH', "Kick-n'-Hat", 'Kick', 'Closed-HH',
];

describe('freeCodeCamp Drum Machine — Test Suite', () => {
  describe('1. #drum-machine container', () => {
    test('should be visible', () => {
      const { container } = render(App);
      const dm = container.querySelector('#drum-machine');
      expect(dm).toBeInTheDocument();
      expect(dm).toBeVisible();
    });

    test('should contain an element with id="display"', () => {
      const { container } = render(App);
      const dm = container.querySelector('#drum-machine');
      const display = dm.querySelector('#display');
      expect(display).toBeInTheDocument();
      expect(dm.contains(display)).toBe(true);
    });

    test('should contain 9 clickable .drum-pad elements', () => {
      const { container } = render(App);
      const dm = container.querySelector('#drum-machine');
      const pads = dm.querySelectorAll('.drum-pad');
      expect(pads.length).toBe(9);
      pads.forEach((pad) => {
        expect(pad.tagName.toLowerCase()).toBe('button');
      });
    });
  });

  describe('2. Each .drum-pad has an inner audio element', () => {
    test('should have exactly one <audio> child with src ending in .mp3', () => {
      const { container } = render(App);
      const pads = container.querySelectorAll('#drum-machine .drum-pad');
      pads.forEach((pad) => {
        const audios = pad.querySelectorAll('audio');
        expect(audios.length).toBe(1);
        expect(audios[0].src).toMatch(/\.mp3(\?.*)?$/);
      });
    });

    test('Heater Kit pads should have audio src from freecodecamp S3 bucket', () => {
      const { container } = render(App);
      const pads = container.querySelectorAll('#drum-machine .drum-pad');
      pads.forEach((pad) => {
        const audio = pad.querySelector('audio');
        if (audio) {
          expect(audio.src).toMatch(/s3\.amazonaws\.com\/freecodecamp\/drums\//);
        }
      });
    });
  });

  describe('3. Each .drum-pad has a single letter trigger', () => {
    test('each pad should display a single uppercase letter (Q W E A S D Z X C)', () => {
      const { container } = render(App);
      const pads = container.querySelectorAll('#drum-machine .drum-pad');
      const letters = Array.from(pads).map((p) => p.textContent.trim().charAt(0));
      HEATER_KEYS.forEach((key) => {
        expect(letters).toContain(key);
      });
    });
  });

  describe('4. Clicking a .drum-pad triggers the audio and updates the display', () => {
    test('clicking the first pad should play its audio and update #display text', async () => {
      const { container } = render(App);
      const firstPad = container.querySelector('#drum-machine .drum-pad');
      const audio = firstPad.querySelector('audio');
      const playSpy = vi.spyOn(audio, 'play');

      await fireEvent.click(firstPad);
      expect(playSpy).toHaveBeenCalled();

      const display = container.querySelector('#display');
      expect(display.textContent).toContain(HEATER_IDS[0]);
    });
  });

  describe('5. Power button toggles functionality', () => {
    test('clicking the power button should disable all pads', async () => {
      const { container } = render(App);
      const powerBtn = Array.from(container.querySelectorAll('button')).find(
        (b) => /power/i.test(b.textContent)
      );
      expect(powerBtn).toBeDefined();

      const padsBefore = container.querySelectorAll('#drum-machine .drum-pad');
      const firstPad = padsBefore[0];
      const audio = firstPad.querySelector('audio');
      const playSpy = vi.spyOn(audio, 'play');

      await fireEvent.click(powerBtn);
      await tick();

      await fireEvent.click(firstPad);
      expect(playSpy).not.toHaveBeenCalled();

      await fireEvent.click(powerBtn);
      await tick();

      await fireEvent.click(firstPad);
      expect(playSpy).toHaveBeenCalled();
    });
  });

  describe('6. Volume slider is present and functional', () => {
    test('should have an input[type=range]', () => {
      const { container } = render(App);
      const ranges = container.querySelectorAll('#drum-machine input[type="range"]');
      expect(ranges.length).toBeGreaterThanOrEqual(1);
      const volume = ranges[ranges.length - 1];
      expect(volume.min).toBe('0');
      expect(volume.max).toBe('1');
    });

    test('changing volume should update displayed value', async () => {
      const { container } = render(App);
      const ranges = container.querySelectorAll('#drum-machine input[type="range"]');
      const volume = ranges[ranges.length - 1];

      await fireEvent.input(volume, { target: { value: '0.7' } });

      const display = container.querySelector('#display');
      expect(display.textContent).toMatch(/70/);
    });
  });

  describe('7. Sound Bank switching', () => {
    test('should provide a way to switch between sound banks', () => {
      expect(SOUND_BANKS.length).toBeGreaterThanOrEqual(2);
      SOUND_BANKS.forEach((bank) => {
        expect(bank).toHaveProperty('id');
        expect(bank).toHaveProperty('name');
        expect(bank.sounds.length).toBe(9);
        bank.sounds.forEach((s) => {
          expect(s).toHaveProperty('keyTrigger');
          expect(s).toHaveProperty('id');
        });
      });
    });
  });
});