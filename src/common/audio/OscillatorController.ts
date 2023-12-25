
export class OscillatorController {

  audioContext: AudioContext;
  oscillator: OscillatorNode | null;
  gainNode: GainNode;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.oscillator = null;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  startOscillator(frequency: number, fadeTime = 0.01) {
    this.stopOscillator();
    this.oscillator = new OscillatorNode(this.audioContext);
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    this.oscillator.connect(this.gainNode);
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + fadeTime);
    this.oscillator.start();
  }

  changeFrequency(frequency: number) {
    if (this.oscillator) {
      this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    }
  }

  stopOscillator(fadeTime = 0.01) {
    if (this.oscillator) {
      const currentTime = this.audioContext.currentTime;
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0, currentTime + fadeTime);
      this.oscillator.stop(currentTime + fadeTime);
      this.oscillator = null;
    }
  }

  playForSecond(frequency: number, duration: number = 0.1) {
    this.startOscillator(frequency);
    setTimeout(() => {
      this.stopOscillator();
    }, duration * 1000);
  }
}
