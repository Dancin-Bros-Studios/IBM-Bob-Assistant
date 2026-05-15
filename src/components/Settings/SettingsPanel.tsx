import React, { useState, useEffect } from 'react';
import { useBobStore } from '@store/useBobStore';
import { tauriService } from '@services/tauri/tauriService';
import { soundService } from '@services/sound/soundService';
import { Settings, Key, Bell, Monitor, Trash2, MessageSquare } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const { settings, updateSettings, clearMessages, messages } = useBobStore();
  const [apiKey, setApiKey] = useState(settings.llmApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);

  // Sync sound service with settings
  useEffect(() => {
    soundService.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleSaveApiKey = () => {
    updateSettings({ llmApiKey: apiKey });
    alert('API Key saved!');
  };

  const handleToggleBrowserMonitoring = async () => {
    if (!settings.browserMonitoringEnabled) {
      const granted = await tauriService.requestBrowserMonitoringPermission();
      if (granted) {
        updateSettings({ browserMonitoringEnabled: true });
        alert('Browser monitoring enabled! Note: Full functionality requires browser extension.');
      }
    } else {
      await tauriService.disableBrowserMonitoring();
      updateSettings({ browserMonitoringEnabled: false });
    }
  };

  const handleClearChat = () => {
    if (messages.length === 0) {
      alert('Chat is already empty!');
      return;
    }
    
    if (confirm(`Are you sure you want to clear all ${messages.length} messages? This cannot be undone.`)) {
      clearMessages();
      soundService.playSuccess();
      alert('Chat history cleared!');
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2" style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '8px',
        fontWeight: 'bold',
      }}>
        <Settings size={16} />
        Settings
      </div>

      {/* LLM Provider */}
      <div className="panel-raised p-2">
        <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '11px' }}>
          AI Provider
        </div>
        <div className="flex flex-col gap-1">
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="llmProvider"
              value="openai"
              checked={settings.llmProvider === 'openai'}
              onChange={(e) => updateSettings({ llmProvider: e.target.value as 'openai' | 'anthropic' })}
            />
            OpenAI (GPT-4)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="llmProvider"
              value="anthropic"
              checked={settings.llmProvider === 'anthropic'}
              onChange={(e) => updateSettings({ llmProvider: e.target.value as 'openai' | 'anthropic' })}
            />
            Anthropic (Claude)
          </label>
        </div>
      </div>

      {/* API Key */}
      <div className="panel-raised p-2">
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '8px', 
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <Key size={12} />
          API Key
        </div>
        <div className="flex flex-col gap-1">
          <input
            className="input"
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key..."
            style={{ fontSize: '11px' }}
          />
          <div className="flex gap-1">
            <button
              className="button"
              onClick={() => setShowApiKey(!showApiKey)}
              style={{ flex: 1 }}
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
            <button
              className="button"
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              style={{ flex: 1 }}
            >
              Save
            </button>
          </div>
          <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>
            Get your API key from {settings.llmProvider === 'openai' ? 'platform.openai.com' : 'console.anthropic.com'}
          </div>
        </div>
      </div>

      {/* Window Settings */}
      <div className="panel-raised p-2">
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '8px', 
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <Monitor size={12} />
          Window
        </div>
        <div className="flex flex-col gap-1">
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              className="checkbox"
              type="checkbox"
              checked={settings.alwaysOnTop}
              onChange={async (e) => {
                updateSettings({ alwaysOnTop: e.target.checked });
                await tauriService.setAlwaysOnTop(e.target.checked);
              }}
            />
            Always on top
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              className="checkbox"
              type="checkbox"
              checked={settings.startWithWindows}
              onChange={(e) => updateSettings({ startWithWindows: e.target.checked })}
            />
            Start with Windows
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="panel-raised p-2">
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '8px', 
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <Bell size={12} />
          Notifications
        </div>
        <div className="flex flex-col gap-1">
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              className="checkbox"
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
            />
            Enable notifications
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              className="checkbox"
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => {
                updateSettings({ soundEnabled: e.target.checked });
                soundService.setEnabled(e.target.checked);
                if (e.target.checked) {
                  soundService.playSuccess();
                }
              }}
            />
            Enable sound effects
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              className="checkbox"
              type="checkbox"
              checked={settings.voiceEnabled}
              onChange={(e) => updateSettings({ voiceEnabled: e.target.checked })}
            />
            Enable voice (coming soon)
          </label>
        </div>
      </div>

      {/* Browser Monitoring */}
      <div className="panel-raised p-2">
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '8px', 
          fontSize: '11px',
        }}>
          Browser Monitoring
        </div>
        <div className="flex flex-col gap-1">
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              className="checkbox"
              type="checkbox"
              checked={settings.browserMonitoringEnabled}
              onChange={handleToggleBrowserMonitoring}
            />
            Monitor active browser tabs
          </label>
          <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>
            Allows Bob to see which websites you have open (requires permission)
          </div>
        </div>
      </div>

      {/* Character Name */}
      <div className="panel-raised p-2">
        <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '11px' }}>
          Character Name
        </div>
        <input
          className="input"
          type="text"
          value={settings.characterName}
          onChange={(e) => updateSettings({ characterName: e.target.value })}
          placeholder="Bob"
          style={{ fontSize: '11px' }}
        />
      </div>

      {/* Chat Management */}
      <div className="panel-raised p-2">
        <div style={{
          fontWeight: 'bold',
          marginBottom: '8px',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <MessageSquare size={12} />
          Chat Management
        </div>
        <div className="flex flex-col gap-1">
          <button
            className="button"
            onClick={handleClearChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              width: '100%',
            }}
          >
            <Trash2 size={12} />
            Clear Chat History ({messages.length} messages)
          </button>
          <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>
            Permanently delete all chat messages
          </div>
        </div>
      </div>
    </div>
  );
};

// Made with Bob
