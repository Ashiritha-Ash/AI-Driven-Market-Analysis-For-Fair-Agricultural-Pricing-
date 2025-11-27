
import { CropData } from '../types';

/**
 * Generates synthetic but realistic agricultural market data.
 * It simulates seasonality using sine waves and adds random variance for realism.
 */
export const generateHistoricalData = (crop: string, district: string, market: string, days: number = 90): CropData[] => {
  const data: CropData[] = [];
  const today = new Date();
  
  // Base price logic simulating different crop values
  let basePrice = 40;
  let volatility = 10;
  
  if (crop.includes('Tomato')) { basePrice = 35; volatility = 20; }
  else if (crop.includes('Onion')) { basePrice = 60; volatility = 25; }
  else if (crop.includes('Potato')) { basePrice = 35; volatility = 5; }
  else if (crop.includes('Carrot')) { basePrice = 70; volatility = 12; }
  else if (crop.includes('Brinjal')) { basePrice = 45; volatility = 8; }
  else if (crop.includes('Chilli')) { basePrice = 80; volatility = 15; }
  else if (crop.includes('Banana')) { basePrice = 30; volatility = 4; }
  else if (crop.includes('Coconut')) { basePrice = 25; volatility = 2; }
  else if (crop.includes('Garlic')) { basePrice = 140; volatility = 30; }
  else if (crop.includes('Ginger')) { basePrice = 100; volatility = 20; }
  else if (crop.includes('Tea')) { basePrice = 20; volatility = 2; }
  else if (crop.includes('Turmeric')) { basePrice = 85; volatility = 5; }

  // District/Market modifier
  // E.g., Nilgiris carrots are cheaper locally than in Chennai
  if (district === 'Nilgiris' && (crop.includes('Carrot') || crop.includes('Potato') || crop.includes('Tea'))) {
      basePrice *= 0.7; // Cheaper at source
  }
  if ((district === 'Dharmapuri' || district === 'Krishnagiri') && crop.includes('Tomato')) {
      basePrice *= 0.8; // Cheaper at source
  }
  
  // Market variation: Wholesale markets are usually cheaper
  if (market && (market.toLowerCase().includes('wholesale') || market.toLowerCase().includes('mandi'))) {
      basePrice *= 0.85; 
  } else if (market && market.toLowerCase().includes('uzhavar')) {
      basePrice *= 0.90; // Farmers market cheaper than retail
  }

  // Ensure positive price
  basePrice = Math.max(10, basePrice);

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate Seasonality (Sine wave)
    const seasonFactor = Math.sin(date.getTime() / (1000 * 60 * 60 * 24 * 30)) * 10;
    
    // Random market noise
    const noise = (Math.random() - 0.5) * volatility;
    
    // Calculate final synthetic price
    let price = Math.max(5, Math.floor(basePrice + seasonFactor + noise));
    
    // Synthetic Weather
    // Rain often happens in 'monsoon' months (Oct-Dec in TN)
    const month = date.getMonth();
    const isMonsoon = month >= 9 && month <= 11; // Oct, Nov, Dec
    const rainfall = isMonsoon ? Math.random() * 40 : Math.random() * 5;
    const temperature = 28 + (Math.random() * 8) - (isMonsoon ? 4 : 0);

    // Weather shock effect on price (High rain spikes perishable prices)
    if (rainfall > 25 && (crop.includes('Tomato') || crop.includes('Onion'))) {
        price += (price * 0.3); // 30% jump
    }

    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price),
      rainfall: parseFloat(rainfall.toFixed(1)),
      temperature: parseFloat(temperature.toFixed(1))
    });
  }

  return data;
};
