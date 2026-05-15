import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBobStore } from '@store/useBobStore';
import type { EmotionalState } from '../../types';

interface BobCharacterProps {
  size?: number;
}

export const BobCharacter: React.FC<BobCharacterProps> = ({ size = 120 }) => {
  const { emotionalState, isThinking } = useBobStore();
  const [blinkState, setBlinkState] = useState(false);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const getCharacterEmoji = (state: EmotionalState): string => {
    const emojiMap: Record<EmotionalState, string> = {
      happy: '😊',
      excited: '🤩',
      thinking: '🤔',
      confused: '😕',
      sad: '😢',
      sleeping: '😴',
      working: '💼',
    };
    return emojiMap[state];
  };

  const getCharacterColor = (state: EmotionalState): string => {
    const colorMap: Record<EmotionalState, string> = {
      happy: '#FFD700',
      excited: '#FF6B6B',
      thinking: '#4ECDC4',
      confused: '#95E1D3',
      sad: '#A8DADC',
      sleeping: '#B8B8D0',
      working: '#FFA07A',
    };
    return colorMap[state];
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
    }}>
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.05, 1] : 1,
          rotate: emotionalState === 'confused' ? [0, -5, 5, 0] : 0,
        }}
        transition={{
          duration: isThinking ? 1 : 0.5,
          repeat: isThinking ? Infinity : 0,
        }}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: getCharacterColor(emotionalState),
          border: '3px solid #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.5,
          position: 'relative',
          boxShadow: '4px 4px 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Face */}
        <div style={{ position: 'relative' }}>
          {/* Eyes */}
          <div style={{
            display: 'flex',
            gap: size * 0.15,
            marginBottom: size * 0.1,
          }}>
            <motion.div
              animate={{ scaleY: blinkState ? 0.1 : 1 }}
              transition={{ duration: 0.1 }}
              style={{
                width: size * 0.12,
                height: size * 0.12,
                background: '#000',
                borderRadius: '50%',
              }}
            />
            <motion.div
              animate={{ scaleY: blinkState ? 0.1 : 1 }}
              transition={{ duration: 0.1 }}
              style={{
                width: size * 0.12,
                height: size * 0.12,
                background: '#000',
                borderRadius: '50%',
              }}
            />
          </div>

          {/* Mouth */}
          {emotionalState === 'sleeping' ? (
            // Sleeping mouth (small line)
            <div style={{
              width: size * 0.2,
              height: 2,
              background: '#000',
              marginTop: size * 0.08,
            }} />
          ) : emotionalState === 'confused' ? (
            // Confused mouth (wavy)
            <div style={{
              width: size * 0.25,
              height: size * 0.08,
              border: '2px solid #000',
              borderRadius: '50%',
              borderTop: 'none',
              borderBottom: '2px solid #000',
              marginTop: size * 0.05,
              transform: 'scaleX(0.8)',
            }} />
          ) : emotionalState === 'thinking' ? (
            // Thinking mouth (small circle - "hmm")
            <div style={{
              width: size * 0.12,
              height: size * 0.12,
              border: '2px solid #000',
              borderRadius: '50%',
              marginTop: size * 0.05,
            }} />
          ) : emotionalState === 'excited' ? (
            // Excited mouth (big O - surprised/excited)
            <div style={{
              width: size * 0.18,
              height: size * 0.18,
              border: '3px solid #000',
              borderRadius: '50%',
              background: '#000',
              marginTop: size * 0.05,
            }} />
          ) : emotionalState === 'working' ? (
            // Working mouth (determined smile)
            <div style={{
              width: size * 0.28,
              height: size * 0.18,
              border: '2px solid #000',
              borderRadius: '50% 50% 0 0',
              borderBottom: 'none',
              marginTop: size * 0.05,
            }} />
          ) : emotionalState === 'happy' ? (
            // Happy mouth (wide grin :D)
            <div style={{
              width: size * 0.32,
              height: size * 0.2,
              border: '3px solid #000',
              borderRadius: '50% 50% 0 0',
              borderBottom: 'none',
              marginTop: size * 0.05,
            }} />
          ) : (
            // Sad mouth (frown)
            <div style={{
              width: size * 0.25,
              height: size * 0.15,
              border: '2px solid #000',
              borderRadius: '0 0 50% 50%',
              borderTop: 'none',
              borderBottom: '2px solid #000',
              marginTop: size * 0.05,
            }} />
          )}
        </div>

        {/* Thinking dots */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                position: 'absolute',
                top: -20,
                right: -10,
                display: 'flex',
                gap: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    width: 6,
                    height: 6,
                    background: '#000',
                    borderRadius: '50%',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Character name */}
      <div style={{
        fontFamily: 'MS Sans Serif, sans-serif',
        fontSize: '11px',
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
        Bob
      </div>

      {/* Emotional state indicator */}
      <div style={{
        fontSize: '9px',
        color: '#666',
        textAlign: 'center',
      }}>
        {emotionalState.charAt(0).toUpperCase() + emotionalState.slice(1)}
      </div>
    </div>
  );
};

// Made with Bob
