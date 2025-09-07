import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Character, TTSSettings } from '../types';
import { DEFAULT_CHARACTER_INFO } from '../constants';

interface Settings {
  character: Character;
  ttsSettings: TTSSettings;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  resetToDefaults: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'ai-character-chat-settings';

const getInitialSettings = (): Settings => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      // More robust validation for the settings object
      if (
        parsed.character &&
        parsed.character.name &&
        parsed.character.avatarUrl &&
        parsed.character.systemInstruction &&
        parsed.ttsSettings &&
        typeof parsed.ttsSettings.type === 'string'
      ) {
        if (parsed.ttsSettings.type === 'external' && typeof parsed.ttsSettings.apiUrl === 'string') {
          return parsed;
        }
        if (parsed.ttsSettings.type === 'browser') {
          return parsed;
        }
      }
    }
  } catch (error) {
    console.error("Failed to parse settings from localStorage", error);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  }
  return {
    character: DEFAULT_CHARACTER_INFO,
    ttsSettings: { type: 'browser' },
  };
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<Settings>(getInitialSettings);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  const setSettings = (newSettings: Settings) => {
    setSettingsState(newSettings);
  };

  const resetToDefaults = () => {
    setSettingsState({
        character: DEFAULT_CHARACTER_INFO,
        ttsSettings: { type: 'browser' },
    });
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettings, resetToDefaults }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
