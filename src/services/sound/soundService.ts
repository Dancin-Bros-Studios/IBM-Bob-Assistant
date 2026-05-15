import { invoke } from '@tauri-apps/api/tauri';

export type WindowsSound = 
  | 'SystemAsterisk'      // Info sound
  | 'SystemExclamation'   // Warning sound
  | 'SystemHand'          // Error sound
  | 'SystemNotification'  // Notification sound
  | 'SystemQuestion'      // Question sound
  | 'SystemStart'         // Windows startup
  | 'SystemExit'          // Windows shutdown
  | 'MenuCommand'         // Menu click
  | 'MenuPopup'           // Menu open
  | 'Default';            // Default beep

export class SoundService {
  private enabled: boolean = true;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  async playSound(sound: WindowsSound): Promise<void> {
    if (!this.enabled) return;

    try {
      await invoke('play_system_sound', { soundName: sound });
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  // Convenience methods for common actions
  async playMessageReceived() {
    await this.playSound('SystemNotification');
  }

  async playMessageSent() {
    await this.playSound('MenuCommand');
  }

  async playError() {
    await this.playSound('SystemHand');
  }

  async playSuccess() {
    await this.playSound('SystemAsterisk');
  }

  async playWarning() {
    await this.playSound('SystemExclamation');
  }

  async playQuestion() {
    await this.playSound('SystemQuestion');
  }

  async playClick() {
    await this.playSound('MenuCommand');
  }

  async playOpen() {
    await this.playSound('MenuPopup');
  }

  async playTaskComplete() {
    await this.playSound('SystemAsterisk');
  }

  async playAppStart() {
    await this.playSound('SystemStart');
  }
}

export const soundService = new SoundService();

// Made with Bob
