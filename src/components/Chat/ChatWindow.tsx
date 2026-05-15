import React, { useState, useRef, useEffect } from 'react';
import { useBobStore } from '@store/useBobStore';
import { createLLMService } from '@services/llm/llmService';
import { tauriService } from '@services/tauri/tauriService';
import { soundService } from '@services/sound/soundService';
import { voiceService } from '@services/voice/voiceService';
import { Send } from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    addMessage, 
    settings, 
    setEmotionalState, 
    setThinking 
  } = useBobStore();

  const llmService = useRef(
    createLLMService(settings.llmProvider, settings.llmApiKey)
  );

  useEffect(() => {
    llmService.current = createLLMService(settings.llmProvider, settings.llmApiKey);
  }, [settings.llmProvider, settings.llmApiKey]);

  useEffect(() => {
    voiceService.setEnabled(settings.voiceEnabled);
  }, [settings.voiceEnabled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper function to speak assistant messages
  const speakMessage = (text: string) => {
    if (settings.voiceEnabled) {
      voiceService.speak(text, {
        rate: 1.0,
        pitch: 1.0,
        volume: 0.8
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setIsProcessing(true);
    setThinking(true);
    setEmotionalState('thinking');

    // Play send sound
    await soundService.playMessageSent();

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    try {
      // Analyze intent
      const intent = await llmService.current.analyzeIntent(userMessage);

      // Handle system commands
      if (intent.intent === 'open-app' && intent.target) {
        try {
          await tauriService.openApplication(intent.target);
          await soundService.playSuccess();
          const message = `Opening ${intent.target} for you!`;
          addMessage({
            role: 'assistant',
            content: message + ' 🚀',
            emotionalState: 'excited',
          });
          setEmotionalState('excited');
          speakMessage(message);
        } catch (error) {
          await soundService.playError();
          const message = `Sorry, I couldn't open that application.`;
          addMessage({
            role: 'assistant',
            content: `${message} ${error}`,
            emotionalState: 'confused',
          });
          setEmotionalState('confused');
          speakMessage(message);
        }
      } else if (intent.intent === 'open-website' && intent.target) {
        try {
          await tauriService.openWebsite(intent.target);
          await soundService.playSuccess();
          const message = `Opening ${intent.target} in your browser!`;
          addMessage({
            role: 'assistant',
            content: message + ' 🌐',
            emotionalState: 'happy',
          });
          setEmotionalState('happy');
          speakMessage(message);
        } catch (error) {
          await soundService.playError();
          const message = `Sorry, I couldn't open that website.`;
          addMessage({
            role: 'assistant',
            content: `${message} ${error}`,
            emotionalState: 'confused',
          });
          setEmotionalState('confused');
          speakMessage(message);
        }
      } else if (intent.intent === 'open-file' && intent.target) {
        try {
          await tauriService.openFile(intent.target);
          await soundService.playSuccess();
          const message = `Opening that file for you!`;
          addMessage({
            role: 'assistant',
            content: message + ' 📄',
            emotionalState: 'working',
          });
          setEmotionalState('working');
          speakMessage(message);
        } catch (error) {
          await soundService.playError();
          const message = `Sorry, I couldn't open that file.`;
          addMessage({
            role: 'assistant',
            content: `${message} ${error}`,
            emotionalState: 'confused',
          });
          speakMessage(message);
          setEmotionalState('confused');
        }
      } else {
        // Regular chat
        const response = await llmService.current.chat(messages.concat([{
          id: crypto.randomUUID(),
          role: 'user',
          content: userMessage,
          timestamp: new Date(),
        }]));

        await soundService.playMessageReceived();
        addMessage({
          role: 'assistant',
          content: response,
          emotionalState: 'happy',
        });
        setEmotionalState('happy');
        speakMessage(response);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      await soundService.playError();
      const message = 'Oops! Something went wrong. Please check your API key in settings.';
      addMessage({
        role: 'assistant',
        content: message + ' 😅',
        emotionalState: 'confused',
      });
      setEmotionalState('confused');
      speakMessage(message);
    } finally {
      setIsProcessing(false);
      setThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col" style={{ flex: 1, overflow: 'hidden' }}>
      {/* Messages Area */}
      <div 
        className="panel"
        style={{ 
          flex: 1, 
          overflow: 'auto',
          marginBottom: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            padding: '20px',
            fontSize: '11px',
          }}>
            👋 Hi! I'm Bob, your desktop companion!
            <br />
            Ask me anything or tell me to open apps, websites, or files!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                padding: '8px',
                background: message.role === 'user' ? '#fff' : '#e0e0e0',
                border: '1px solid #808080',
                borderRadius: '2px',
                fontSize: '11px',
                wordWrap: 'break-word',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {message.role === 'user' ? 'You' : 'Bob'}
              </div>
              <div>{message.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-1">
        <textarea
          className="textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isProcessing}
          rows={2}
          style={{ flex: 1, resize: 'none' }}
        />
        <button
          className="button"
          onClick={handleSend}
          disabled={isProcessing || !input.trim()}
          style={{ 
            width: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

// Made with Bob
