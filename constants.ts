
export const APP_TITLE = "AgriMarket AI";
export const APP_SUBTITLE = "Fair Pricing & Market Intelligence for Tamil Nadu";
export const MISSED_CALL_NUMBER = "1800-123-4567";

export const TN_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
  "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", 
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", 
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", 
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", 
  "Viluppuram", "Virudhunagar"
];

export const TAMIL_MAP: Record<string, string> = {
  // Districts
  "Ariyalur": "அரியலூர்", "Chengalpattu": "செங்கல்பட்டு", "Chennai": "சென்னை",
  "Coimbatore": "கோயம்புத்தூர்", "Cuddalore": "கடலூர்", "Dharmapuri": "தர்மபுரி",
  "Dindigul": "திண்டுக்கல்", "Erode": "ஈரோடு", "Kallakurichi": "கள்ளக்குறிச்சி",
  "Kancheepuram": "காஞ்சிபுரம்", "Kanyakumari": "கன்னியாகுமரி", "Karur": "கரூர்",
  "Krishnagiri": "கிருஷ்ணகிரி", "Madurai": "மதுரை", "Mayiladuthurai": "மயிலாடுதுறை",
  "Nagapattinam": "நாகப்பட்டினம்", "Namakkal": "நாமக்கல்", "Nilgiris": "நீலகிரி",
  "Perambalur": "பெரம்பலூர்", "Pudukkottai": "புதுக்கோட்டை", "Ramanathapuram": "ராமநாதபுரம்",
  "Ranipet": "ராணிப்பேட்டை", "Salem": "சேலம்", "Sivaganga": "சிவகங்கை",
  "Tenkasi": "தென்காசி", "Thanjavur": "தஞ்சாவூர்", "Theni": "தேனி",
  "Thoothukudi": "தூத்துக்குடி", "Tiruchirappalli": "திருச்சிராப்பள்ளி", "Tirunelveli": "திருநெல்வேலி",
  "Tirupathur": "திருப்பத்தூர்", "Tiruppur": "திருப்பூர்", "Tiruvallur": "திருவள்ளூர்",
  "Tiruvannamalai": "திருவண்ணாமலை", "Tiruvarur": "திருவாரூர்", "Vellore": "வேலூர்",
  "Viluppuram": "விழுப்புரம்", "Virudhunagar": "விருதுநகர்",

  // Commodities
  "Tomato": "தக்காளி", "Onion (Big)": "பெரிய வெங்காயம்", "Onion (Small)": "சின்ன வெங்காயம்",
  "Potato": "உருளைக்கிழங்கு", "Brinjal (Vari)": "கத்திரிக்காய்", "Lady's Finger": "வெண்டைக்காய்",
  "Banana (Poovan)": "பூவன் வாழைப்பழம்", "Coconut": "தேங்காய்", "Ginger": "இஞ்சி",
  "Garlic": "பூண்டு", "Carrot": "கேரட்", "Beans": "பீன்ஸ்", "Beetroot": "பீட்ரூட்",
  "Tea (Green Leaf)": "தேயிலை", "Turmeric": "மஞ்சள்", "Mango (Senthooram)": "மாம்பழம்",
  "Jasmine": "மல்லிகை", "Snake Gourd": "புடலங்காய்", "Drumstick": "முருங்கைக்காய்",
  "Cauliflower": "காலிஃபிளவர்", "Cabbage": "முட்டைக்கோஸ்",
  "Green Chilli": "பச்சை மிளகாய்", "Tapioca": "மரவள்ளிக்கிழங்கு",
  "Rice (Paddy)": "நெல்", "Cotton": "பருத்தி", "Maize": "சோளம்", 
  "Groundnut": "நிலக்கடலை", "Sugarcane": "கரும்பு", "Coconut (Tender)": "இளநீர்",
  "Bitter Gourd": "பாகற்காய்", "Bottle Gourd": "சுரைக்காய்",

  // Keywords
  "Price": "விலை",
  "Trend": "போக்கு",
  "UP": "உயர்வு 📈",
  "DOWN": "சரிவு 📉",
  "STABLE": "மாற்றமில்லை ➖",
  "Alert": "எச்சரிக்கை"
};

// Major known markets covering ALL 38 districts
export const MAJOR_MARKETS: Record<string, string[]> = {
  // Major Cities
  "Chennai": ["Koyambedu Wholesale", "Egmore", "T. Nagar", "Aminjikarai", "Mylapore"],
  "Coimbatore": ["Mettupalayam", "TK Market", "Ukkadam", "Saibaba Colony", "Gandhipuram"],
  "Madurai": ["Mattuthavani", "Paravai", "Simmakkal", "Yanaikkal"],
  "Tiruchirappalli": ["Gandhi Market", "Manapparai", "Thillai Nagar", "Srirangam"],
  "Salem": ["Leigh Bazaar", "Shevapet", "Attur", "Omalur"],
  "Tirunelveli": ["Nainar Kulam", "Palayamkottai", "Tenkasi Market"],
  "Erode": ["Nethaji Market", "Gobi", "Sathyamangalam", "Perundurai"],
  "Tiruppur": ["Thennampalayam", "Palladam", "Udumalpet"],
  "Vellore": ["Nethaji Market", "Katpadi", "Gudiyatham"],
  "Thoothukudi": ["VOC Market", "Kovilpatti", "Tiruchendur"],
  "Nagercoil": ["Vadasery", "Thovalai Flower Market", "Marthandam"], // Mapped to Kanyakumari usually
  "Kanyakumari": ["Vadasery", "Thovalai Flower Market", "Marthandam", "Kaliyakkaavilai"],
  
  // Northern Districts
  "Tiruvallur": ["Tiruvallur Town", "Avadi", "Ponneri", "Gummidipoondi"],
  "Kancheepuram": ["Raja Market", "Sunguvarchatram", "Walajabad"],
  "Chengalpattu": ["Chengalpattu GH Market", "Tambaram", "Pallavaram", "Madurantakam"],
  "Ranipet": ["Ranipet Market", "Arcot", "Walajapet"],
  "Tirupathur": ["Tirupathur Market", "Ambur", "Vaniyambadi"],
  "Tiruvannamalai": ["Tiruvannamalai Regulated", "Arni", "Polur"],
  "Viluppuram": ["Viluppuram Market", "Tindivanam", "Gingee"],
  "Kallakurichi": ["Kallakurichi Regulated", "Chinnasalem", "Tirukkoyilur"],
  "Cuddalore": ["Cuddalore OT", "Panruti (Jackfruit/Cashew)", "Chidambaram", "Nellikuppam"],

  // Central Districts
  "Ariyalur": ["Ariyalur Market", "Jayankondam", "Sendurai"],
  "Perambalur": ["Perambalur New Market", "Veppanthattai"],
  "Karur": ["Karur Gandhi Market", "Kulithalai", "Aravakurichi"],
  "Pudukkottai": ["Pudukkottai Sandhai", "Aranthangi", "Alangudi"],
  "Thanjavur": ["Kumbakonam", "Thanjavur Town", "Pattukkottai", "Orathanadu"],
  "Tiruvarur": ["Tiruvarur Market", "Mannargudi", "Thiruthuraipoondi"],
  "Nagapattinam": ["Nagapattinam Bazaar", "Velankanni", "Vedaranyam"],
  "Mayiladuthurai": ["Mayiladuthurai Market", "Sirkazhi", "Kuthalam"],

  // Western Districts
  "Namakkal": ["Namakkal Uzhavar Sandhai", "Rasipuram", "Tiruchengode"],
  "Dharmapuri": ["Dharmapuri Town", "Pennagaram", "Harur", "Palacode"],
  "Krishnagiri": ["Krishnagiri Market", "Hosur", "Rayakottai", "Kaveripattinam"],
  "Nilgiris": ["Ooty Municipal Market", "Coonoor", "Kotagiri", "Gudalur"],
  "Dindigul": ["Oddanchatram (Major)", "Dindigul Gandhi Market", "Palani", "Batlagundu"],

  // Southern Districts
  "Theti": ["Theni Uzhavar Sandhai", "Cumbum", "Bodinayakanur", "Periyakulam"], // Legacy typo handling
  "Theni": ["Theni Uzhavar Sandhai", "Cumbum", "Bodinayakanur", "Periyakulam"],
  "Virudhunagar": ["Virudhunagar Market", "Rajapalayam", "Sivakasi", "Aruppukottai"],
  "Sivaganga": ["Sivaganga Market", "Karaikudi", "Manamadurai"],
  "Ramanathapuram": ["Ramnad Market", "Paramakudi", "Rameswaram"],
  "Tenkasi": ["Tenkasi Municipal Market", "Pavoorchatram", "Alangulam", "Sankarankovil"]
};

// Helper to get markets for any district
export const getMarketsForDistrict = (district: string): string[] => {
  if (MAJOR_MARKETS[district]) {
    return MAJOR_MARKETS[district];
  }
  // Fallback (Should typically not be reached if all districts are mapped)
  return [
    `${district} Main Market`,
    `${district} Uzhavar Sandhai`,
    `${district} Town Market`,
    `${district} Regulated Market`
  ];
};

export const COMMON_COMMODITIES = [
  "Tomato", "Onion (Big)", "Onion (Small)", "Potato", "Brinjal (Vari)", 
  "Brinjal (Disco)", "Lady's Finger", "Green Chilli", "Ginger", "Garlic", 
  "Banana (Poovan)", "Banana (Robusta)", "Coconut", "Coconut (Tender)", "Tapioca", 
  "Drumstick", "Beans", "Cabbage", "Cauliflower", "Beetroot", "Snake Gourd",
  "Bitter Gourd", "Bottle Gourd", "Rice (Paddy)", "Maize", "Groundnut", "Cotton", "Sugarcane"
];

// District specific overrides
export const getCommoditiesForDistrict = (district: string): string[] => {
  const base = [...COMMON_COMMODITIES];
  
  if (district === "Nilgiris") {
    return ["Carrot", "Potato", "Cabbage", "Beans", "Beetroot", "Tea (Green Leaf)", "Garlic", "Radish", "Turnip", "Broccoli", "Strawberry", ...base];
  }
  if (district === "Dharmapuri" || district === "Krishnagiri") {
    return ["Tomato", "Mango (Senthooram)", "Mango (Alphonso)", "Tamarind", "Ragi", "Groundnut", ...base];
  }
  if (district === "Erode" || district === "Salem") {
    return ["Turmeric", "Tapioca", "Sugarcane", "Coconut", "Cotton", "Maize", ...base];
  }
  if (district === "Theni" || district === "Madurai" || district === "Dindigul") {
    return ["Jasmine", "Banana", "Grapes", "Cardamom", "Cotton", ...base];
  }
  if (district === "Thanjavur" || district === "Tiruvarur" || district === "Nagapattinam") {
    return ["Rice (Paddy)", "Black Gram", "Green Gram", "Coconut", "Sugarcane", ...base];
  }
  if (district === "Cuddalore") {
    return ["Cashew", "Jackfruit", "Sugarcane", "Groundnut", ...base];
  }
  if (district === "Kanyakumari") {
    return ["Rubber", "Coconut", "Banana (Nendran)", "Pineapple", "Clove", ...base];
  }
  
  return Array.from(new Set(base)).sort(); // De-dupe and sort
};

export const DEFAULT_WEATHER = {
  rainfall: 12.5,
  temperature: 28.4
};
