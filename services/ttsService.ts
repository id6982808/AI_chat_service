// This service provides a pluggable interface for Text-to-Speech synthesis.

import { TTSSettings } from "../types";

export interface TTSService {
  speak(text: string): Promise<void>;
}

class BrowserTTSService implements TTSService {
  private japaneseVoice: SpeechSynthesisVoice | undefined;
  private voicesLoaded: Promise<void>;

  constructor() {
    this.voicesLoaded = this.loadVoices();
  }

  private loadVoices(): Promise<void> {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        this.findJapaneseVoice();
        resolve();
        return;
      }
      window.speechSynthesis.onvoiceschanged = () => {
        this.findJapaneseVoice();
        resolve();
      };
    });
  }

  private findJapaneseVoice() {
    this.japaneseVoice = window.speechSynthesis.getVoices().find(voice => voice.lang === 'ja-JP');
    if (!this.japaneseVoice) {
      console.warn("Japanese voice not found.");
    }
  }

  public async speak(text: string): Promise<void> {
    await this.voicesLoaded;

    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        console.warn("Speech Synthesis not supported by this browser.");
        return reject("Speech Synthesis not supported");
      }

      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.japaneseVoice) {
        utterance.voice = this.japaneseVoice;
      } else {
        console.warn("Using default voice as Japanese voice was not found.");
      }
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
        reject(event.error);
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }
}

class ExternalTTSService implements TTSService {
  // This class simulates an external API. In a real application, this would
  // contain a `fetch` call to the specified `apiUrl`.
  private browserTts = new BrowserTTSService();

  constructor(private apiUrl: string, private apiKey?: string) {}

  public async speak(text: string): Promise<void> {
    console.log(`[Simulated External API] Requesting speech from: ${this.apiUrl}`);
    console.log(`[Simulated External API] Using API Key: ${this.apiKey ? 'Yes' : 'No'}`);
    console.log(`[Simulated External API] Text: "${text}"`);

    // In a real implementation, you would use fetch like this:
    /*
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey || ''}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();

    } catch (error) {
       console.error("External TTS service failed:", error);
       // Fallback to browser TTS if the API call fails
       return this.browserTts.speak(text);
    }
    */
    
    // For this simulation, we'll just add latency and use the browser's API.
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.browserTts.speak(text);
  }
}

const browserTtsService = new BrowserTTSService();

export const getTTSService = (settings: TTSSettings): TTSService => {
  switch (settings.type) {
    case 'external':
      return new ExternalTTSService(settings.apiUrl, settings.apiKey);
    case 'browser':
    default:
      return browserTtsService;
  }
};
