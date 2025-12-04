export interface Scene {
  id: string;
  name: string; // Spanish name for display
  prompt: string; // English prompt for the AI to ensure better quality
  icon: string;
}

export interface Era {
  id: string;
  name: string;
  scenes: Scene[];
}

export type AppState = 'HOME' | 'CAPTURE' | 'SELECT' | 'PROCESSING' | 'RESULT';

export interface GeneratedImageResult {
  imageUrl: string;
  promptUsed: string;
}