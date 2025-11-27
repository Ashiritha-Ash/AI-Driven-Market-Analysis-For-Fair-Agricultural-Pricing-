
export interface CropData {
  date: string;
  price: number;
  rainfall: number; // mm
  temperature: number; // celsius
}

export interface PredictionResult {
  predictedPrice: number;
  confidence: number;
  reasoning: string;
  factors: string[];
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface PredictionRequest {
  state: string;
  district: string;
  market: string;
  commodity: string;
}

export interface SmsRegistration {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  phoneNumber: string;
  timestamp: number;
}
