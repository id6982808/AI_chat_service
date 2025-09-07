export enum Sender {
  USER = 'user',
  CHARACTER = 'character',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
}

export interface Character {
  name: string;
  avatarUrl: string;
  systemInstruction: string;
}

// --- TTS Service Types ---

export interface BrowserTTSSettings {
  type: 'browser';
}

export interface ExternalApiTTSSettings {
  type: 'external';
  apiUrl: string;
  apiKey?: string;
}

export type TTSSettings = BrowserTTSSettings | ExternalApiTTSSettings;
