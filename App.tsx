
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sprout, BarChart3, MapPin, Calendar, Smartphone, CheckCircle, 
  PhoneCall, Languages, ArrowRight, Users, Database, X, Bell, Trash2, Activity, Play, Send, Download
} from 'lucide-react';
import { 
  TN_DISTRICTS, 
  getMarketsForDistrict, 
  getCommoditiesForDistrict,
  APP_TITLE, 
  APP_SUBTITLE,
  MISSED_CALL_NUMBER,
  TAMIL_MAP 
} from './constants';
import { generateHistoricalData } from './services/dataService';
import { getPricePrediction } from './services/geminiService';
import { CropData, PredictionResult, SmsRegistration } from './types';
import PriceChart from './components/PriceChart';
import PredictionCard from './components/PredictionCard';

// Local Storage Keys
const STORAGE_KEY_REGISTRATIONS = 'agrimarket_registrations';

function App() {
  // --- State: Price Prediction Form ---
  const [predDistrict, setPredDistrict] = useState<string>('Nilgiris'); 
  const [predMarket, setPredMarket] = useState<string>('');
  const [predCommodity, setPredCommodity] = useState<string>('Carrot');
  const [history, setHistory] = useState<CropData[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // --- State: SMS Form ---
  const [smsDistrict, setSmsDistrict] = useState<string>(TN_DISTRICTS[0]);
  const [smsMarket, setSmsMarket] = useState<string>('');
  const [smsCommodity, setSmsCommodity] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  // --- State: Registration Management & Logs ---
  const [registrations, setRegistrations] = useState<SmsRegistration[]>([]);
  const [showRegModal, setShowRegModal] = useState<boolean>(false);
  const [smsLogs, setSmsLogs] = useState<{id: string, text: string, time: string}[]>([]);

  // --- Dynamic Data Helpers ---
  const predMarkets = useMemo(() => getMarketsForDistrict(predDistrict), [predDistrict]);
  const predCommodities = useMemo(() => getCommoditiesForDistrict(predDistrict), [predDistrict]);
  
  const smsMarkets = useMemo(() => getMarketsForDistrict(smsDistrict), [smsDistrict]);
  const smsCommodities = useMemo(() => getCommoditiesForDistrict(smsDistrict), [smsDistrict]);

  // --- Initialization & Effects ---

  // Load registrations from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
    if (stored) {
      try {
        setRegistrations(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse registrations", e);
      }
    }
  }, []);

  // Reset dependent fields when district changes (Prediction)
  useEffect(() => {
    if (predMarkets.length > 0) setPredMarket(predMarkets[0]);
    if (predCommodities.length > 0) setPredCommodity(predCommodities[0]);
  }, [predDistrict, predMarkets, predCommodities]);

  // Reset dependent fields when district changes (SMS)
  useEffect(() => {
    if (smsMarkets.length > 0) setSmsMarket(smsMarkets[0]);
    if (smsCommodities.length > 0) setSmsCommodity(smsCommodities[0]);
  }, [smsDistrict, smsMarkets, smsCommodities]);

  // Load historical data when inputs change (Prediction Tab)
  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      const data = generateHistoricalData(predCommodity, predDistrict, predMarket);
      setHistory(data);
      setPrediction(null); // Reset prediction when data changes
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [predCommodity, predDistrict, predMarket]);

  // --- Handlers ---

  const handlePredict = async () => {
    if (history.length === 0) return;
    
    setAnalyzing(true);
    try {
      const result = await getPricePrediction(predCommodity, predDistrict, predMarket, history);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadCSV = () => {
    if (history.length === 0) return;

    const headers = ["Date", "Price (INR)", "Rainfall (mm)", "Temperature (C)"];
    const rows = history.map(row => [
      row.date,
      row.price,
      row.rainfall,
      row.temperature
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${predCommodity}_${predDistrict}_Price_History.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    const newRegistration: SmsRegistration = {
      id: crypto.randomUUID(),
      state: 'Tamil Nadu',
      district: smsDistrict,
      market: smsMarket,
      commodity: smsCommodity,
      phoneNumber: phoneNumber,
      timestamp: Date.now()
    };

    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(updatedRegistrations));
    
    // Immediate feedback log in bilingual format
    const tamilDistrict = TAMIL_MAP[smsDistrict] || smsDistrict;
    const tamilCommodity = TAMIL_MAP[smsCommodity] || smsCommodity;
    const welcomeLog = {
        id: crypto.randomUUID(),
        text: `✅ Registered: ${phoneNumber} for ${smsCommodity} | பதிவு: ${tamilCommodity} (${tamilDistrict})`,
        time: new Date().toLocaleTimeString()
    };
    setSmsLogs(prev => [welcomeLog, ...prev].slice(0, 8));

    // Simulate API call delay
    setTimeout(() => {
        setIsRegistered(true);
    }, 800);
  };

  const deleteRegistration = (id: string) => {
    const updated = registrations.filter(r => r.id !== id);
    setRegistrations(updated);
    localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(updated));
  };

  // BROADCAST FEATURE: Sends alerts to ALL registered users
  const triggerDailyBroadcast = () => {
    if (registrations.length === 0) {
        const log = {
            id: crypto.randomUUID(),
            text: `⚠️ No registered farmers found. Register a number first.`,
            time: new Date().toLocaleTimeString()
        };
        setSmsLogs(prev => [log, ...prev].slice(0, 8));
        return;
    }

    // Header Log
    setSmsLogs(prev => [{
        id: crypto.randomUUID(),
        text: `📢 Starting Daily Broadcast for ${registrations.length} farmers...`,
        time: new Date().toLocaleTimeString()
    }, ...prev]);

    // Send to each user with a slight stagger for visual effect
    registrations.forEach((reg, index) => {
        setTimeout(() => {
            // Generate real data for this user's preference
            const data = generateHistoricalData(reg.commodity, reg.district, reg.market, 2);
            const current = data[data.length-1];
            const previous = data[data.length-2];
            const trend = current.price > previous.price ? 'UP' : (current.price < previous.price ? 'DOWN' : 'STABLE');

            const tamilCommodity = TAMIL_MAP[reg.commodity] || reg.commodity;
            const tamilTrend = TAMIL_MAP[trend] || trend;

            const logEntry = {
                id: crypto.randomUUID(),
                text: `📤 Sent to ${reg.phoneNumber}: ${reg.commodity} ₹${current.price} | விலை: ₹${current.price}`,
                time: new Date().toLocaleTimeString()
            };
            setSmsLogs(prev => [logEntry, ...prev].slice(0, 8));

        }, (index + 1) * 800); // 800ms delay between each msg
    });
  };

  // Demo: Simulate Missed Call with Auto-Cut and Reply
  const simulateMissedCall = () => {
    const time = new Date().toLocaleTimeString();
    // Use the entered number if available, otherwise a default for demo
    const callingNumber = phoneNumber || '9876543210';
    
    // 1. Log Incoming Call
    setSmsLogs(prev => [{
        id: crypto.randomUUID(),
        text: `📞 Incoming Call from ${callingNumber}...`,
        time
    }, ...prev].slice(0, 8));

    // 2. Auto-Cut after 1.5 seconds
    setTimeout(() => {
        setSmsLogs(prev => [{
            id: crypto.randomUUID(),
            text: `🚫 Call Disconnected (Auto-cut)`,
            time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 8));

        // 3. Send SMS Reply after another 1 second
        setTimeout(() => {
            // Try to find the user in our DB
            const registeredUser = registrations.find(r => r.phoneNumber === callingNumber);
            
            // If registered, use their preferences. If not, use the current form values as a fallback/demo.
            const commodity = registeredUser ? registeredUser.commodity : (smsCommodity || 'Tomato');
            const district = registeredUser ? registeredUser.district : (smsDistrict || 'Chennai');
            const market = registeredUser ? registeredUser.market : (smsMarket || 'Koyambedu');
            
            // Generate Real Price Data
            const marketData = generateHistoricalData(commodity, district, market, 2);
            const currentPrice = marketData[marketData.length - 1].price;
            const prevPrice = marketData[marketData.length - 2].price;
            const trend = currentPrice > prevPrice ? 'UP' : (currentPrice < prevPrice ? 'DOWN' : 'STABLE');

            const tamilCommodity = TAMIL_MAP[commodity] || commodity;
            const tamilTrend = TAMIL_MAP[trend] || trend;
            
            setSmsLogs(prev => [{
                id: crypto.randomUUID(),
                text: `📨 SMS REPLY: ${commodity} ₹${currentPrice} (${trend}) | விலை: ₹${currentPrice} (${tamilTrend})`,
                time: new Date().toLocaleTimeString()
            }, ...prev].slice(0, 8));

        }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans relative">
      {/* Navbar */}
      <nav className="bg-emerald-800 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout size={28} className="text-emerald-300" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">{APP_TITLE}</h1>
              <p className="text-xs text-emerald-200 hidden sm:block">{APP_SUBTITLE}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-emerald-900/50 px-3 py-1 rounded-full border border-emerald-700">
                <MapPin size={14} className="text-emerald-300"/>
                <span className="text-xs font-semibold">Tamil Nadu</span>
             </div>
             <button className="text-sm font-medium hover:text-emerald-200 transition">About</button>
             <div className="h-8 w-8 bg-emerald-700 rounded-full flex items-center justify-center border border-emerald-600 shadow-inner">
                <span className="font-bold text-xs">TN</span>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Forms */}
            <div className="xl:col-span-4 space-y-8">
                
                {/* 1. Price Prediction Form */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-emerald-50 border-b border-emerald-100 p-4">
                        <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                            <BarChart3 size={20} className="text-emerald-600"/> 
                            Predict Market Price
                        </h2>
                        <p className="text-xs text-emerald-700 mt-1">Get overall district estimates</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {/* State (Read Only) */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">State</label>
                            <div className="w-full bg-slate-100 border border-slate-200 text-slate-600 text-sm rounded-lg p-3 font-medium cursor-not-allowed flex items-center justify-between">
                                Tamil Nadu
                                <CheckCircle size={14} className="text-emerald-500"/>
                            </div>
                        </div>

                        {/* District */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">District</label>
                            <select 
                                value={predDistrict} 
                                onChange={(e) => setPredDistrict(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3"
                            >
                                {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* Markets */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Market</label>
                            <select 
                                value={predMarket} 
                                onChange={(e) => setPredMarket(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3"
                            >
                                {predMarkets.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <p className="text-[10px] text-slate-400 mt-1 italic">
                                Prediction considers all markets in {predDistrict}
                            </p>
                        </div>

                        {/* Commodity */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Commodity</label>
                            <select 
                                value={predCommodity} 
                                onChange={(e) => setPredCommodity(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-3"
                            >
                                {predCommodities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Date (Auto) */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Date</label>
                            <div className="w-full bg-slate-50 border border-slate-200 text-slate-500 text-sm rounded-lg p-3 flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        <button 
                            onClick={handlePredict}
                            disabled={analyzing}
                            className={`w-full text-white font-bold py-3.5 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-4
                                ${analyzing 
                                ? 'bg-emerald-400 cursor-wait' 
                                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg active:scale-95'
                                }`}
                        >
                            {analyzing ? (
                                <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Calculating...</span>
                                </>
                            ) : (
                                <>
                                <BarChart3 size={18} />
                                <span>Predict Price</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* 2. SMS Alert Form */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                    {isRegistered && (
                        <div className="absolute inset-0 bg-emerald-50 z-10 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                             <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                                <CheckCircle size={24} className="text-emerald-600" />
                             </div>
                             <h3 className="text-lg font-bold text-emerald-900 mb-1">Registered Successfully!</h3>
                             <p className="text-slate-600 text-xs mb-4 max-w-[250px] mx-auto">
                                Daily alerts for <span className="font-semibold">{smsCommodity}</span> in <span className="font-semibold">{smsDistrict}</span>.
                             </p>
                             
                             {/* Language Info */}
                             <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-100/50 px-3 py-1.5 rounded-full mb-4">
                                <Languages size={14} />
                                Alerts in Tamil & English
                             </div>
                             
                             <button 
                                onClick={() => setIsRegistered(false)}
                                className="mt-4 text-xs text-emerald-600 hover:text-emerald-700 font-medium underline"
                             >
                                Register another number
                             </button>
                        </div>
                    )}

                    <div className="bg-blue-50 border-b border-blue-100 p-4">
                        <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                            <Smartphone size={20} className="text-blue-600"/> 
                            SMS Alerts Registration
                        </h2>
                    </div>
                    <form onSubmit={handleRegister} className="p-6 space-y-4">
                         {/* State (Read Only) */}
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">State</label>
                            <div className="w-full bg-slate-100 border border-slate-200 text-slate-600 text-sm rounded-lg p-3 font-medium cursor-not-allowed">
                                Tamil Nadu
                            </div>
                        </div>

                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">District</label>
                            <select 
                                value={smsDistrict} 
                                onChange={(e) => setSmsDistrict(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                            >
                                {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Market</label>
                            <select 
                                value={smsMarket} 
                                onChange={(e) => setSmsMarket(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                            >
                                {smsMarkets.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Commodity</label>
                            <select 
                                value={smsCommodity} 
                                onChange={(e) => setSmsCommodity(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                            >
                                {smsCommodities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Mobile Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-slate-500 text-sm font-medium">+91</span>
                                </div>
                                <input 
                                    type="tel" 
                                    placeholder="98765 43210"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g,'').slice(0,10))}
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pl-12"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <Smartphone size={18} />
                            <span>Register for Alerts</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                             <button 
                                type="button" 
                                onClick={triggerDailyBroadcast}
                                className="flex items-center justify-center gap-2 text-xs text-blue-700 hover:text-blue-900 font-bold py-2 px-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                             >
                                <Send size={14} />
                                Broadcast Daily Alerts
                             </button>
                             <button 
                                type="button" 
                                onClick={() => setShowRegModal(true)}
                                className="flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-700 font-medium py-2 px-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50"
                             >
                                <Database size={14} />
                                View Registered
                             </button>
                        </div>
                    </form>
                </div>

                {/* 3. Missed Call Simulation (Demo) - MOVED HERE for Accessibility */}
                <div className="bg-white rounded-xl shadow-sm border border-emerald-200 overflow-hidden">
                    <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex items-center justify-between">
                         <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                            <PhoneCall size={20} className="text-emerald-600"/> 
                            Missed Call Demo
                        </h2>
                        <div className="text-xs font-mono bg-white px-2 py-1 rounded border border-emerald-200 text-emerald-700">
                            {MISSED_CALL_NUMBER}
                        </div>
                    </div>
                    <div className="p-6">
                        <p className="text-xs text-slate-500 mb-4">
                            Simulate calling the toll-free number. The system will auto-cut and send an SMS with prices for your registered number (or current selection if unregistered).
                        </p>
                        <button 
                            onClick={simulateMissedCall}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            <Play size={16} fill="currentColor"/>
                            Simulate Call Now
                        </button>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: Results & Charts */}
            <div className="xl:col-span-8 space-y-6">
                
                {/* Intro Banner */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {prediction ? `${predCommodity} - ${predDistrict}` : 'Market Intelligence Dashboard'}
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">
                            {prediction 
                                ? `Showing overall price analysis for ${predDistrict} district.` 
                                : 'Select a crop and district to view overall price predictions.'}
                        </p>
                    </div>
                    {prediction && (
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 uppercase tracking-wide flex items-center gap-1">
                            Live Analysis <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                    )}
                </div>

                {/* Main Visualization Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
                    {/* Prediction Card */}
                    <PredictionCard 
                        prediction={prediction} 
                        isLoading={analyzing} 
                        cropName={predCommodity}
                    />

                    {/* Chart Card */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                         <div className="mb-4 px-2 flex justify-between items-start">
                             <div>
                                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Historical Trends</h3>
                                 <p className="text-xs text-slate-500">Last 90 days in {predMarket || 'selected market'}</p>
                             </div>
                             <button
                                onClick={handleDownloadCSV}
                                disabled={history.length === 0}
                                className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Download Data as CSV"
                             >
                                <Download size={14} />
                                CSV
                             </button>
                         </div>
                         <div className="flex-grow min-h-[300px]">
                             <PriceChart data={history} />
                         </div>
                    </div>
                </div>

                {/* Statistics Strip */}
                {history.length > 0 && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-bold">Avg Price (90d)</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">
                            ₹{Math.floor(history.reduce((acc, curr) => acc + curr.price, 0) / history.length || 0)}
                        </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-bold">Highest Peak</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-1">
                            ₹{Math.max(...history.map(h => h.price), 0)}
                        </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-bold">Lowest Dip</p>
                        <p className="text-2xl font-bold text-red-500 mt-1">
                            ₹{Math.min(...history.map(h => h.price), 999)}
                        </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-bold">Volatility</p>
                        <p className="text-2xl font-bold text-blue-500 mt-1">
                             {/* Simple Volatility Calc */}
                             {Math.floor((Math.max(...history.map(h => h.price)) - Math.min(...history.map(h => h.price))) / 2)}%
                        </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </main>

      {/* Registrations Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users size={20} className="text-blue-600"/>
                Registered Numbers
              </h3>
              <button onClick={() => setShowRegModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition">
                <X size={20} className="text-slate-500"/>
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-grow">
              {registrations.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Database size={48} className="mx-auto mb-4 opacity-30"/>
                  <p>No farmers registered yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3">District</th>
                        <th className="px-4 py-3">Market</th>
                        <th className="px-4 py-3">Commodity</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {registrations.map(reg => (
                        <tr key={reg.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-800">{reg.district}</td>
                          <td className="px-4 py-3 text-slate-600">{reg.market}</td>
                          <td className="px-4 py-3">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-semibold">
                              {reg.commodity}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-600">{reg.phoneNumber}</td>
                          <td className="px-4 py-3 text-right">
                            <button 
                              onClick={() => deleteRegistration(reg.id)}
                              className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                              title="Delete Registration"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live SMS Simulation Toaster */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {smsLogs.map((log) => (
          <div key={log.id} className="bg-slate-900/90 backdrop-blur text-white p-3 rounded-lg shadow-xl text-xs animate-in slide-in-from-right flex items-start gap-3 border border-slate-700 pointer-events-auto">
             <div className="bg-emerald-500/20 p-1.5 rounded-full mt-0.5">
               <Bell size={14} className="text-emerald-400"/>
             </div>
             <div>
               <p className="font-semibold text-emerald-300 mb-0.5 flex justify-between w-full gap-4">
                 SMS Dispatched
                 <span className="text-slate-400 font-mono text-[10px]">{log.time}</span>
               </p>
               <p className="text-slate-300 leading-tight">{log.text}</p>
             </div>
          </div>
        ))}
        {registrations.length > 0 && smsLogs.length === 0 && (
           <div className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg border border-slate-200 text-[10px] text-slate-500 flex items-center gap-2 pointer-events-auto max-w-fit self-end">
              <Activity size={12} className="text-emerald-500 animate-pulse"/>
              SMS System Active • Monitoring {registrations.length} farmers
           </div>
        )}
      </div>

    </div>
  );
}

export default App;
