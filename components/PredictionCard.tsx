import React from 'react';
import { PredictionResult } from '../types';
import { TrendingUp, TrendingDown, Minus, Info, AlertTriangle, CloudRain } from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionResult | null;
  isLoading: boolean;
  cropName: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, isLoading, cropName }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col justify-center items-center animate-pulse min-h-[300px]">
        <div className="h-12 w-12 rounded-full bg-emerald-100 mb-4 flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium">Analyzing market trends...</p>
        <p className="text-xs text-slate-400 mt-2">Checking rainfall patterns & historical volatility</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col justify-center items-center min-h-[300px]">
        <div className="h-12 w-12 rounded-full bg-slate-100 mb-4 flex items-center justify-center text-slate-400">
          <Info size={24} />
        </div>
        <p className="text-slate-500 font-medium text-center">Select a crop and district to view price prediction</p>
      </div>
    );
  }

  const TrendIcon = {
    'UP': TrendingUp,
    'DOWN': TrendingDown,
    'STABLE': Minus
  }[prediction.trend];

  const trendColor = {
    'UP': 'text-red-500 bg-red-50', // Price up is usually bad for consumer, good for farmer, but let's color code by "heat"
    'DOWN': 'text-emerald-500 bg-emerald-50',
    'STABLE': 'text-blue-500 bg-blue-50'
  }[prediction.trend];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-50">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Forecast</h3>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-extrabold text-slate-800">
            ₹{prediction.predictedPrice}
          </span>
          <span className="text-lg text-slate-500 font-medium mb-2">/ kg</span>
        </div>
        
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mt-4 ${trendColor}`}>
          <TrendIcon size={16} />
          <span>Trend: {prediction.trend}</span>
        </div>
      </div>

      <div className="p-6 bg-slate-50/50 flex-grow">
        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <Info size={16} className="text-emerald-600"/> 
            AI Analysis
        </h4>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {prediction.reasoning}
        </p>

        <h4 className="font-semibold text-slate-800 mb-2 mt-4 text-xs uppercase tracking-wide">Key Drivers</h4>
        <div className="flex flex-wrap gap-2">
          {prediction.factors.map((factor, idx) => (
            <span key={idx} className="bg-white border border-slate-200 px-3 py-1 rounded-md text-xs font-medium text-slate-600 flex items-center gap-1">
                {factor.toLowerCase().includes('rain') && <CloudRain size={12} className="text-blue-400"/>}
                {factor.toLowerCase().includes('volatility') && <AlertTriangle size={12} className="text-orange-400"/>}
                {factor}
            </span>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
             <span>Confidence Score</span>
             <div className="flex items-center gap-2">
                 <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${prediction.confidence}%` }}
                     ></div>
                 </div>
                 <span className="font-mono">{prediction.confidence}%</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
