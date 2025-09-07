import { useState, useCallback, useEffect } from 'react';
import { Message, Sender } from '../types';
import { getChatResponse } from '../services/geminiService';
import { getTTSService } from '../services/ttsService';
import { useSettings } from '../contexts/SettingsContext';

export const useChat = () => {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // When character settings change, reset the chat history.
  useEffect(() => {
    setMessages([
      {
        id: 'init',
        text: `こんにちは！${settings.character.name}です。何かお話ししましょう。`,
        sender: Sender.CHARACTER,
      }
    ]);
  }, [settings.character]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: Sender.USER,
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const responseText = await getChatResponse(text, settings.character.systemInstruction);

      const characterMessage: Message = {
        id: `char-${Date.now()}`,
        text: responseText,
        sender: Sender.CHARACTER,
      };

      const tts = getTTSService(settings.ttsSettings);
      await tts.speak(responseText);
      
      setMessages(prevMessages => [...prevMessages, characterMessage]);

    } catch (error) {
      console.error("Failed to send message or receive response:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'エラーが発生しました。しばらくしてからもう一度お試しください。',
        sender: Sender.CHARACTER,
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  return { messages, isLoading, sendMessage };
};
