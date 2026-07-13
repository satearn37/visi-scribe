export interface ExtractionResponse {
  text?: string;
  error?: string;
}

export interface ExtractionState {
  file: File | null;
  previewUrl: string | null;
  text: string;
  isLoading: boolean;
  error: string | null;
}
