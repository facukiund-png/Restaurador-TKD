export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface RestorationConfig {
  aspectRatio: AspectRatio;
  promptEnhancement: string;
}

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  errorMessage?: string;
}