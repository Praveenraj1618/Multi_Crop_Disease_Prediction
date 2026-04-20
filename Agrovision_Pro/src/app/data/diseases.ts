export interface Disease {
  id: number;
  yolo_id: string;
  name: string;
  plant: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  description: string;
  symptoms: string[];
  immediateAction: string;
  organicCure: string;
  chemicalCure: string;
  preventionTips: string[];
}

export const diseases: Disease[] = [
  {
    id: 1,
    yolo_id: 'Banana_Healthy',
    name: 'Healthy',
    plant: 'Banana',
    severity: 'low',
    confidence: 99,
    description: 'The banana plant shows no signs of disease. The leaves are vibrant, and the plant structure appears entirely healthy.',
    symptoms: ['None. Plant is healthy.'],
    immediateAction: 'No immediate action required. Continue regular maintenance.',
    organicCure: 'Maintain current organic fertilization routine.',
    chemicalCure: 'None required.',
    preventionTips: ['Ensure proper drainage', 'Keep optimal spacing', 'Maintain routine nutrient checks']
  },
  {
    id: 2,
    yolo_id: 'Banana_Sigatoka',
    name: 'Sigatoka (Yellow/Black)',
    plant: 'Banana',
    severity: 'high',
    confidence: 85,
    description: 'Sigatoka is a devastating leaf spot disease caused by Mycosphaerella fungi. It significantly destroys the leaf area, reducing yield.',
    symptoms: ['Small pale green or yellow streaks on leaves', 'Streaks darken to brown or black', 'Lesions join together causing leaf death'],
    immediateAction: 'Prune heavily infected leaves and burn them away from the plantation.',
    organicCure: 'Apply neem oil and compost tea extracts to boost plant immunity.',
    chemicalCure: 'Systemic fungicides containing propiconazole or chlorothalonil.',
    preventionTips: ['Ensure good plantation drainage', 'Weed control to reduce humidity', 'Plant disease-resistant varieties']
  },
  {
    id: 3,
    yolo_id: 'Chilli_Bacterial_Spot',
    name: 'Bacterial Spot',
    plant: 'Chilli',
    severity: 'high',
    confidence: 91,
    description: 'A bacterial disease caused by Xanthomonas campestris. It causes severe defoliation and spots on fruits.',
    symptoms: ['Small, water-soaked, yellowish spots on leaves', 'Spots turn dark brown and angular', 'Defoliation of lower leaves'],
    immediateAction: 'Remove severely infected plants. Avoid overhead irrigation.',
    organicCure: 'Copper-based organic sprays or Bacillus subtilis biofungicide.',
    chemicalCure: 'Copper oxychloride or streptomycin sprays under agricultural guidance.',
    preventionTips: ['Use certified disease-free seeds', 'Rotate crops every 2-3 years', 'Increase plant spacing for airflow']
  },
  {
    id: 4,
    yolo_id: 'Chilli_Healthy',
    name: 'Healthy',
    plant: 'Chilli',
    severity: 'low',
    confidence: 99,
    description: 'The chilli plant shows no signs of disease. The leaves are green and the plant structure is healthy.',
    symptoms: ['None. Plant is healthy.'],
    immediateAction: 'No immediate action required.',
    organicCure: 'Continue regular organic maintenance.',
    chemicalCure: 'None required.',
    preventionTips: ['Maintain good soil moisture', 'Monitor for pests']
  },
  {
    id: 5,
    yolo_id: 'Chilli_Leaf_Curl',
    name: 'Leaf Curl Virus',
    plant: 'Chilli',
    severity: 'high',
    confidence: 90,
    description: 'A viral disease primarily transmitted by whiteflies. It causes severe stunting and leaf curling, devastating crop yields.',
    symptoms: ['Upward curling and crinkling of leaves', 'Stunted plant growth', 'Yellowing of leaf margins'],
    immediateAction: 'Uproot and destroy infected plants immediately to prevent spread. Do not compost.',
    organicCure: 'Spray neem oil or insecticidal soap to control whitefly vectors. The virus itself cannot be cured.',
    chemicalCure: 'Systemic insecticides like Imidacloprid to control the whitefly vector.',
    preventionTips: ['Use yellow sticky traps', 'Grow barrier crops like maize', 'Use resistant hybrid varieties']
  },
  {
    id: 6,
    yolo_id: 'Potato_Early_Blight',
    name: 'Early Blight',
    plant: 'Potato',
    severity: 'medium',
    confidence: 88,
    description: 'Caused by Alternaria solani fungus, infecting older leaves first and causing target-like spots.',
    symptoms: ['Dark brown spots with concentric rings', 'Yellowing around lesions', 'Lower leaves die and drop'],
    immediateAction: 'Remove infected lower leaves and improve air circulation.',
    organicCure: 'Copper fungicide applications or Trichoderma bio-control agents.',
    chemicalCure: 'Mancozeb or Chlorothalonil-based protective fungicides.',
    preventionTips: ['Practice 3-year crop rotation', 'Avoid late-day overhead watering', 'Ensure proper soil nutrition']
  },
  {
    id: 7,
    yolo_id: 'Potato_Healthy',
    name: 'Healthy',
    plant: 'Potato',
    severity: 'low',
    confidence: 99,
    description: 'The potato foliage is healthy with no blights or spots.',
    symptoms: ['None. Plant is healthy.'],
    immediateAction: 'No immediate action required.',
    organicCure: 'Continue balanced organic fertilization.',
    chemicalCure: 'None required.',
    preventionTips: ['Monitor for early signs of blight in humid weather']
  },
  {
    id: 8,
    yolo_id: 'Potato_Late_Blight',
    name: 'Late Blight',
    plant: 'Potato',
    severity: 'high',
    confidence: 95,
    description: 'A terrifying disease caused by Phytophthora infestans (the Irish Potato Famine pathogen). Spread rapidly in cool, wet weather.',
    symptoms: ['Irregular, water-soaked patches on leaves', 'White fuzzy mold on leaf undersides', 'Rapid rotting of foliage and tubers'],
    immediateAction: 'Immediate destruction of infected foliage. Cut stems at ground level if severe.',
    organicCure: 'Preventative copper sprays. Once infected, organic cures are mostly ineffective.',
    chemicalCure: 'Cymoxanil, Dimethomorph, or Metalaxyl fungicides immediately.',
    preventionTips: ['Plant certified disease-free seed potatoes', 'Destroy volunteer potatoes', 'Hill plants properly to protect tubers']
  },
  {
    id: 9,
    yolo_id: 'Rice_Bacterial_Blight',
    name: 'Bacterial Blight',
    plant: 'Rice',
    severity: 'high',
    confidence: 93,
    description: 'Caused by Xanthomonas oryzae, it is one of the most serious rice diseases causing wilting and yellowing.',
    symptoms: ['Water-soaked to yellowish stripes on leaf blades', 'Wavy leaf margins', 'Milky bacterial ooze drops in early morning'],
    immediateAction: 'Drain the field if possible to reduce humidity and bacterial spread.',
    organicCure: 'Application of cow dung extract or Pseudomonas fluorescens.',
    chemicalCure: 'Streptocycline + Copper Oxychloride combination spray.',
    preventionTips: ['Avoid excessive nitrogen fertilizer', 'Use resistant varieties', 'Maintain clean bunds and fields']
  },
  {
    id: 10,
    yolo_id: 'Rice_Blast',
    name: 'Blast',
    plant: 'Rice',
    severity: 'high',
    confidence: 94,
    description: 'Caused by the fungus Magnaporthe oryzae, known as "rice cancer", capable of destroying entire fields.',
    symptoms: ['Diamond or spindle-shaped lesions', 'Lesions with gray centers and brown edges', 'Rotting at the panicle neck'],
    immediateAction: 'Avoid applying high levels of nitrogen fertilizer.',
    organicCure: 'Spray with garlic extract or severe localized burning of highly infected patches.',
    chemicalCure: 'Tricyclazole or Isoprothiolane fungicides at booting stage.',
    preventionTips: ['Plant resistant varieties', 'Split nitrogen applications', 'Ensure continuous flooding if possible']
  },
  {
    id: 11,
    yolo_id: 'Rice_Brownspot',
    name: 'Brown Spot',
    plant: 'Rice',
    severity: 'medium',
    confidence: 89,
    description: 'Caused by Bipolaris oryzae, typically an indicator of poor soil nutrition or water stress.',
    symptoms: ['Small, circular to oval, reddish-brown lesions', 'Spots look like sesame seeds', 'Yellow halo around older spots'],
    immediateAction: 'Apply quick-release balanced fertilizers (N-P-K) as the disease is linked to soil deficiency.',
    organicCure: 'Neem-based seed treatments and compost application.',
    chemicalCure: 'Mancozeb or Propiconazole sprays.',
    preventionTips: ['Use balanced NPK fertilizers', 'Treat seeds before planting', 'Maintain good soil health']
  },
  {
    id: 12,
    yolo_id: 'Rice_Healthy',
    name: 'Healthy',
    plant: 'Rice',
    severity: 'low',
    confidence: 99,
    description: 'The rice crop is healthy, showing vibrant green leaves with no lesions.',
    symptoms: ['None. Plant is healthy.'],
    immediateAction: 'No immediate action required.',
    organicCure: 'Maintain proper water levels.',
    chemicalCure: 'None required.',
    preventionTips: ['Ensure proper flooding and nutrient management']
  },
  {
    id: 13,
    yolo_id: 'Tomato_Early_Blight',
    name: 'Early Blight',
    plant: 'Tomato',
    severity: 'medium',
    confidence: 92,
    description: 'Common fungal disease (Alternaria solani) affecting older leaves first.',
    symptoms: ['Dark brown spots with concentric rings', 'Yellowing surrounding the spots', 'Premature defoliation of lower leaves'],
    immediateAction: 'Prune and remove infected lower leaves to restrict fungal spores.',
    organicCure: 'Spray 5% Neem Oil or Bacillus subtilis solutions.',
    chemicalCure: 'Application of Mancozeb (2g/L) or Chlorothalonil.',
    preventionTips: ['Space plants for airflow', 'Use mulch to prevent soil splashing', 'Rotate crops']
  },
  {
    id: 14,
    yolo_id: 'Tomato_Healthy',
    name: 'Healthy',
    plant: 'Tomato',
    severity: 'low',
    confidence: 99,
    description: 'The tomato plant shows no blights, spots, or nutrient deficiencies.',
    symptoms: ['None. Plant is healthy.'],
    immediateAction: 'No immediate action required.',
    organicCure: 'Continue regular maintenance.',
    chemicalCure: 'None required.',
    preventionTips: ['Stake or cage tomatoes', 'Water deeply and consistently']
  },
  {
    id: 15,
    yolo_id: 'Tomato_Late_Blight',
    name: 'Late Blight',
    plant: 'Tomato',
    severity: 'high',
    confidence: 96,
    description: 'A rapid, destructive disease completely wiping out unprotected tomatoes in wet weather.',
    symptoms: ['Irregular water-soaked spots on leaves', 'White fungal growth on undersides', 'Dark brown, firm lesions on fruits'],
    immediateAction: 'Pull up and destroy infected plants immediately. Do not compost.',
    organicCure: 'Preventive copper-based sprays are the only organic option.',
    chemicalCure: 'Mancozeb or Cymoxanil-based fungicides.',
    preventionTips: ['Avoid overhead watering', 'Ensure excellent ventilation', 'Plant resistant varieties']
  }
];

export const getDiseaseByYoloId = (yolo_id: string, confidence: number): Disease => {
  const found = diseases.find(d => d.yolo_id === yolo_id);
  if (found) {
    return { ...found, confidence };
  }
  return { ...diseases[0], name: "Unknown", confidence };
};

export const getRandomDisease = (): Disease => {
  const randomIndex = Math.floor(Math.random() * diseases.length);
  const disease = { ...diseases[randomIndex] };
  disease.confidence = Math.floor(85 + Math.random() * 13);
  return disease;
};

export interface ScanHistory {
  id: string;
  date: Date;
  disease: Disease;
  imageUrl: string;
  status: 'detected' | 'healthy' | 'uncertain';
}

export const mockScanHistory: ScanHistory[] = [
  {
    id: '1',
    date: new Date(2026, 2, 28),
    disease: diseases[0],
    imageUrl: '',
    status: 'detected'
  },
  {
    id: '2',
    date: new Date(2026, 2, 25),
    disease: diseases[1],
    imageUrl: '',
    status: 'detected'
  },
  {
    id: '3',
    date: new Date(2026, 2, 22),
    disease: diseases[2],
    imageUrl: '',
    status: 'detected'
  }
];

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  location: string;
}

export const mockWeather: WeatherData = {
  temperature: 28,
  humidity: 68,
  condition: 'Partly Cloudy',
  location: 'Tamil Nadu'
};
