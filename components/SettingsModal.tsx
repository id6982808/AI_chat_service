import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Character, TTSSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, setSettings, resetToDefaults } = useSettings();
  const [localCharacter, setLocalCharacter] = useState<Character>(settings.character);
  const [localTts, setLocalTts] = useState<TTSSettings>(settings.ttsSettings);

  useEffect(() => {
    if (isOpen) {
      setLocalCharacter(settings.character);
      setLocalTts(settings.ttsSettings);
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    setSettings({
      character: localCharacter,
      ttsSettings: localTts,
    });
    onClose();
  };

  const handleCharacterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalCharacter({ ...localCharacter, [e.target.name]: e.target.value });
  };
  
  const handleTtsTypeChange = (type: 'browser' | 'external') => {
    if (type === 'browser') {
        setLocalTts({ type: 'browser' });
    } else {
        const currentApiUrl = localTts.type === 'external' ? localTts.apiUrl : '';
        const currentApiKey = localTts.type === 'external' ? localTts.apiKey : '';
        setLocalTts({ type: 'external', apiUrl: currentApiUrl, apiKey: currentApiKey });
    }
  };

  const handleExternalTtsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localTts.type === 'external') {
        setLocalTts({ ...localTts, [e.target.name]: e.target.value });
    }
  };
  
  const handleReset = () => {
    resetToDefaults();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="settings-title" className="text-xl font-bold">設定</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close settings">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="text-lg font-semibold mb-2">キャラクター設定</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                <input type="text" id="name" name="name" value={localCharacter.name} onChange={handleCharacterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">アイコンURL</label>
                <input type="text" id="avatarUrl" name="avatarUrl" value={localCharacter.avatarUrl} onChange={handleCharacterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label htmlFor="systemInstruction" className="block text-sm font-medium text-gray-700 mb-1">キャラクター設定 (System Instruction)</label>
                <textarea id="systemInstruction" name="systemInstruction" rows={4} value={localCharacter.systemInstruction} onChange={handleCharacterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">音声合成サービス</h3>
            <fieldset className="space-y-2">
              <legend className="sr-only">音声合成サービスの種類</legend>
              <div className="flex items-center">
                <input id="tts-browser" name="tts-type" type="radio" checked={localTts.type === 'browser'} onChange={() => handleTtsTypeChange('browser')} className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"/>
                <label htmlFor="tts-browser" className="ml-3 block text-sm font-medium text-gray-700">ブラウザ標準 (日本語)</label>
              </div>
              <div className="flex items-center">
                <input id="tts-external" name="tts-type" type="radio" checked={localTts.type === 'external'} onChange={() => handleTtsTypeChange('external')} className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"/>
                <label htmlFor="tts-external" className="ml-3 block text-sm font-medium text-gray-700">外部API</label>
              </div>
            </fieldset>
            <div className={`mt-4 pl-7 transition-all duration-300 ease-in-out overflow-hidden ${localTts.type === 'external' ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                 <div>
                    <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
                    <input type="text" id="apiUrl" name="apiUrl" value={localTts.type === 'external' ? localTts.apiUrl : ''} onChange={handleExternalTtsChange} placeholder="https://api.example.com/tts" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" disabled={localTts.type !== 'external'} />
                  </div>
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">APIキー (オプション)</label>
                    <input type="password" id="apiKey" name="apiKey" value={localTts.type === 'external' ? (localTts.apiKey || '') : ''} onChange={handleExternalTtsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" disabled={localTts.type !== 'external'}/>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 bg-gray-50 border-t rounded-b-lg">
          <button onClick={handleReset} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
            デフォルトに戻す
          </button>
          <div className="space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              キャンセル
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
