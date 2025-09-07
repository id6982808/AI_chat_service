import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import { useSettings } from '../contexts/SettingsContext';
import SettingsModal from './SettingsModal';
import { Character } from '../types';

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.5 12c0-2.484-2.016-4.5-4.5-4.5s-4.5 2.016-4.5 4.5 2.016 4.5 4.5 4.5 4.5-2.016 4.5-4.5Zm-4.5-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    <path fillRule="evenodd" d="m11.173 3.332.03.131.026.13.045.22.032.164.045.22.04.192.052.242.038.17.06.257.037.152.063.25.035.132.068.243.032.11.072.23.03.095.077.218.028.08.08.198.025.07.086.184.022.058.09.17.02.05.095.158.017.04.1.144.014.03.104.13.01.02.107.114a9.715 9.715 0 0 1 3.25 3.25l.114.107.02.01.13.104.03.014.144.1.04.017.158.095.05.02.17.09.058.022.184.086.07.025.198.08.08.028.218.077.095.03.23.072.11.032.243.068.132.035.25.063.152.037.257.06.17.038.242.052.192.04.22.045.164.032.22.045.13.026.131.03a1.87 1.87 0 0 1-1.22 3.161l-.186.012-.18.013-.25.023-.166.017-.234.025-.156.02-.22.028-.146.02-.206.03-.135.02-.193.03-.125.02-.18.03-.114.018-.168.03-.104.017a9.715 9.715 0 0 1-6.5 0l-.104-.017-.168-.03-.114-.018-.18-.03-.125-.02-.193-.03-.135-.02-.206-.03-.146-.02-.22-.028-.156-.02-.234-.025-.166-.017-.25-.023-.18-.013-.186-.012a1.87 1.87 0 0 1-1.22-3.161l.03-.131.026-.13.045-.22.032-.164.045-.22.04-.192.052-.242.038-.17.06-.257.037-.152.063-.25.035-.132.068-.243.032-.11.072-.23.03-.095.077-.218.028-.08.08-.198.025-.07.086-.184.022-.058.09-.17.02-.05.095-.158.017-.04.1-.144.014-.03.104-.13.01-.02.107-.114a9.715 9.715 0 0 1 3.25-3.25l.114-.107.02-.01.13-.104.03-.014.144-.1.04-.017.158-.095.05-.02.17-.09.058-.022.184-.086.07-.025.198-.08.08-.028.218-.077.095-.03.23-.072.11-.032.243-.068.132-.035.25-.063.152-.037.257-.06.17-.038.242-.052.192-.04.22-.045.164-.032.22-.045.13-.026.131-.03a1.87 1.87 0 0 1 3.16 1.22Z" clipRule="evenodd" />
  </svg>
);


const CharacterHeader: React.FC<{ character: Character, onSettingsClick: () => void }> = ({ character, onSettingsClick }) => (
    <div className="p-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center">
            <img src={character.avatarUrl} alt={character.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
            <h1 className="text-xl font-bold text-gray-800">{character.name}</h1>
        </div>
        <button onClick={onSettingsClick} className="text-gray-500 hover:text-gray-800 transition-colors" aria-label="Open settings">
          <SettingsIcon className="w-6 h-6" />
        </button>
    </div>
);

const TypingIndicator: React.FC<{ character: Character }> = ({ character }) => (
    <div className="flex items-start mb-4">
         <img src={character.avatarUrl} alt="typing" className="w-10 h-10 rounded-full mr-3 object-cover" />
        <div className="bg-gray-100 rounded-lg rounded-bl-none py-3 px-4 flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full mx-1 animate-bounce delay-200"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
        </div>
    </div>
);


const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);
  

const ChatInput: React.FC<{ onSend: (text: string) => void; disabled: boolean }> = ({ onSend, disabled }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend(text);
        setText('');
    };

    return (
        <div className="p-4 border-t bg-white/80 backdrop-blur-sm sticky bottom-0 z-10">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="メッセージを入力..."
                    disabled={disabled}
                    className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition disabled:bg-gray-100"
                />
                <button type="submit" disabled={disabled || !text.trim()} className="p-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:bg-gray-300 transition">
                    <SendIcon className="w-6 h-6" />
                </button>
            </form>
        </div>
    );
};


const ChatInterface: React.FC = () => {
    const { settings } = useSettings();
    const { messages, isLoading, sendMessage } = useChat();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col h-full bg-slate-200" style={{ backgroundImage: 'url(https://picsum.photos/seed/chatbg/400/800)', backgroundSize: 'cover' }}>
            <CharacterHeader character={settings.character} onSettingsClick={() => setIsSettingsOpen(true)} />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} character={settings.character} />
                ))}
                {isLoading && <TypingIndicator character={settings.character} />}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSend={sendMessage} disabled={isLoading} />
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};

export default ChatInterface;
