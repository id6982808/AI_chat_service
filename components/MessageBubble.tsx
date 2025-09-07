import React from 'react';
import { Message, Sender, Character } from '../types';
import { getTTSService } from '../services/ttsService';
import { useSettings } from '../contexts/SettingsContext';

interface MessageBubbleProps {
  message: Message;
  character: Character;
}

const SpeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06z" />
        <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 5.25 5.25 0 0 1 0 7.424.75.75 0 0 1-1.06-1.06 3.75 3.75 0 0 0 0-5.304.75.75 0 0 1 0-1.06z" />
    </svg>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, character }) => {
  const isUser = message.sender === Sender.USER;
  const { settings } = useSettings();

  const handleReplayAudio = () => {
    const tts = getTTSService(settings.ttsSettings);
    tts.speak(message.text);
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-emerald-500 text-white rounded-lg rounded-br-none py-2 px-4 max-w-[80%]">
          <p className="break-words">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start mb-4">
      <img src={character.avatarUrl} alt={character.name} className="w-10 h-10 rounded-full mr-3 flex-shrink-0 object-cover" />
      <div className="flex items-end gap-2">
        <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none py-2 px-4 max-w-[calc(100%-40px)]">
          <p className="break-words">{message.text}</p>
        </div>
        <button onClick={handleReplayAudio} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Replay audio">
            <SpeakerIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageBubble;
