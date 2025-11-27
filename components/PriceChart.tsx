import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { CropData } from '../types';

interface PriceChartProps {
  data: CropData[];
  predictedPrice?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="text-emerald-600 font-bold">
          ₹{payload[0].value} / kg
        </p>
        <p className="text-xs text-slate-500">
          Rain: {payload[0].payload.rainfall}mm
        </p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ data, predictedPrice }) => {
  // Prepare data for the chart. If we have a prediction, we can append it as a future point
  // or handle it visually separately. For now, let's just show history.
  
  return (
    <div className="h-[350px] w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Price History (30 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tick={{fontSize: 12, fill: '#64748b'}} 
            tickMargin={10}
            tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getDate()}/${d.getMonth()+1}`;
            }}
          />
          <YAxis 
            tick={{fontSize: 12, fill: '#64748b'}} 
            domain={['auto', 'auto']}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#059669" 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
