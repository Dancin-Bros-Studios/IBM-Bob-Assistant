import { invoke } from '@tauri-apps/api/tauri';
import { sendNotification } from '@tauri-apps/api/notification';
import { appWindow } from '@tauri-apps/api/window';

export class TauriService {
  // System integration
  async openApplication(appPath: string): Promise<string> {
    try {
      const result = await invoke<string>('open_application', { appPath });
      return result;
    } catch (error) {
      throw new Error(`Failed to open application: ${error}`);
    }
  }

  async openWebsite(url: string): Promise<string> {
    try {
      const result = await invoke<string>('open_website', { url });
      return result;
    } catch (error) {
      throw new Error(`Failed to open website: ${error}`);
    }
  }

  async openFile(filePath: string): Promise<string> {
    try {
      const result = await invoke<string>('open_file', { filePath });
      return result;
    } catch (error) {
      throw new Error(`Failed to open file: ${error}`);
    }
  }

  // Browser monitoring
  async requestBrowserMonitoringPermission(): Promise<boolean> {
    try {
      const result = await invoke<boolean>('request_browser_monitoring_permission');
      return result;
    } catch (error) {
      console.error('Failed to request browser monitoring permission:', error);
      return false;
    }
  }

  async getBrowserMonitoringStatus(): Promise<boolean> {
    try {
      const result = await invoke<boolean>('get_browser_monitoring_status');
      return result;
    } catch (error) {
      console.error('Failed to get browser monitoring status:', error);
      return false;
    }
  }

  async disableBrowserMonitoring(): Promise<boolean> {
    try {
      const result = await invoke<boolean>('disable_browser_monitoring');
      return result;
    } catch (error) {
      console.error('Failed to disable browser monitoring:', error);
      return false;
    }
  }

  async getActiveBrowserTabs(): Promise<string[]> {
    try {
      const result = await invoke<string[]>('get_active_browser_tabs');
      return result;
    } catch (error) {
      console.error('Failed to get active browser tabs:', error);
      return [];
    }
  }

  // Notifications
  async showNotification(title: string, body: string): Promise<void> {
    try {
      await sendNotification({ title, body });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  // Window management
  async setAlwaysOnTop(alwaysOnTop: boolean): Promise<void> {
    try {
      await appWindow.setAlwaysOnTop(alwaysOnTop);
    } catch (error) {
      console.error('Failed to set always on top:', error);
    }
  }

  async startDragging(): Promise<void> {
    try {
      await appWindow.startDragging();
    } catch (error) {
      console.error('Failed to start dragging:', error);
    }
  }

  async minimizeWindow(): Promise<void> {
    try {
      await appWindow.minimize();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  }

  async hideWindow(): Promise<void> {
    try {
      await appWindow.hide();
    } catch (error) {
      console.error('Failed to hide window:', error);
    }
  }

  async showWindow(): Promise<void> {
    try {
      await appWindow.show();
      await appWindow.setFocus();
    } catch (error) {
      console.error('Failed to show window:', error);
    }
  }

  async getSystemInfo(): Promise<{ platform: string; arch: string }> {
    try {
      const result = await invoke<{ platform: string; arch: string }>('get_system_info');
      return result;
    } catch (error) {
      console.error('Failed to get system info:', error);
      return { platform: 'unknown', arch: 'unknown' };
    }
  }
}

export const tauriService = new TauriService();

// Made with Bob
