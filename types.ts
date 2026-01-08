
export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  user: string;
  platform: string;
  text: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface StreamStats {
  timestamp: string;
  viewers: number;
  bitrate: number;
  cpu: number;
}
