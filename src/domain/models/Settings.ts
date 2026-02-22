export interface Settings {
  soundEnabled: boolean;
  autoAdvance: boolean;
  timerFontSize: "normal" | "large" | "xlarge";
}

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: false,
  autoAdvance: true,
  timerFontSize: "large",
};
