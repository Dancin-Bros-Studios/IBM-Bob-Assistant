import React, { useState, useEffect } from 'react';
import { BobCharacter } from '@components/Character/BobCharacter';
import { ChatWindow } from '@components/Chat/ChatWindow';
import { TaskManager } from '@components/Tasks/TaskManager';
import { SettingsPanel } from '@components/Settings/SettingsPanel';
import { TitleBar } from '@components/UI/TitleBar';
import { tauriService } from '@services/tauri/tauriService';
import { MessageSquare, CheckSquare, Settings } from 'lucide-react';
import './styles/retro.css';

type Tab = 'chat' | 'tasks' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  useEffect(() => {
    // Initialize app
    const init = async () => {
      const systemInfo = await tauriService.getSystemInfo();
      console.log('System Info:', systemInfo);
    };
    init();
  }, []);

  return (
    <div className="window">
      {/* Custom Title Bar */}
      <TitleBar />

      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* Character Display */}
        <div style={{ 
          borderBottom: '2px solid #808080',
          background: '#c0c0c0',
        }}>
          <BobCharacter size={100} />
        </div>

        {/* Tab Navigation */}
        <div className="tabs" style={{ padding: '4px 4px 0 4px' }}>
          <button
            className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={12} style={{ marginRight: '4px' }} />
            Chat
          </button>
          <button
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <CheckSquare size={12} style={{ marginRight: '4px' }} />
            Tasks
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={12} style={{ marginRight: '4px' }} />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ 
          flex: 1, 
          padding: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {activeTab === 'chat' && <ChatWindow />}
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-bar-field" style={{ flex: 1 }}>
          Ready
        </div>
        <div className="status-bar-field">
          v0.1.0
        </div>
      </div>
    </div>
  );
}

export default App;

// Made with Bob
