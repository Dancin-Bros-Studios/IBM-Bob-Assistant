// Voice/TTS Service using Web Speech API
class VoiceService {
  private synthesis: SpeechSynthesis;
  private enabled: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
  }) {
    if (!this.enabled) {
      return;
    }

    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set options
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;
    
    if (options?.voice) {
      utterance.voice = options.voice;
    }

    // Event handlers
    utterance.onend = () => {
      this.currentUtterance = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  stop() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  pause() {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  isPaused(): boolean {
    return this.synthesis.paused;
  }
}

export const voiceService = new VoiceService();

// Made with Bob