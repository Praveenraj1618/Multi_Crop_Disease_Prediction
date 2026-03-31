export interface Disease {
  id: number;
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
    name: 'Early Blight',
    plant: 'Tomato',
    severity: 'medium',
    confidence: 92,
    description: 'Early blight is a common tomato disease caused by the fungus Alternaria solani. It typically affects older leaves first.',
    symptoms: [
      'Dark brown spots with concentric rings',
      'Yellowing of leaves around spots',
      'Premature leaf drop'
    ],
    immediateAction: 'Remove infected leaves manually and dispose of them away from the garden.',
    organicCure: 'Spray 5% Neem Oil solution mixed with water every 7 days.',
    chemicalCure: 'Apply Mancozeb (2g/L) or Chlorothalonil fungicide every 10-14 days.',
    preventionTips: [
      'Ensure proper spacing between plants for air circulation',
      'Water at the base of plants, not on leaves',
      'Rotate crops annually'
    ]
  },
  {
    id: 2,
    name: 'Leaf Rust',
    plant: 'Coffee',
    severity: 'high',
    confidence: 88,
    description: 'Coffee leaf rust is a devastating fungal disease caused by Hemileia vastatrix, affecting coffee plants worldwide.',
    symptoms: [
      'Yellow-orange powdery spots on leaf undersides',
      'Premature leaf drop',
      'Reduced coffee bean production'
    ],
    immediateAction: 'Prune and destroy infected leaves immediately. Increase plant spacing.',
    organicCure: 'Apply copper-based organic fungicide (Bordeaux mixture) at 1% concentration.',
    chemicalCure: 'Use systemic fungicides like Triadimefon (0.1%) or Propiconazole (0.1%).',
    preventionTips: [
      'Plant rust-resistant coffee varieties',
      'Maintain optimal shade levels (30-40%)',
      'Regular monitoring and early detection'
    ]
  },
  {
    id: 3,
    name: 'Powdery Mildew',
    plant: 'Grape',
    severity: 'medium',
    confidence: 95,
    description: 'Powdery mildew is a fungal disease that appears as white powdery growth on grape leaves and fruit.',
    symptoms: [
      'White powdery coating on leaves',
      'Distorted or stunted leaf growth',
      'Affected grapes may crack and dry out'
    ],
    immediateAction: 'Remove severely affected leaves. Improve air circulation by pruning.',
    organicCure: 'Spray with potassium bicarbonate solution (1 tablespoon per liter) weekly.',
    chemicalCure: 'Apply sulfur-based fungicide or myclobutanil as per label instructions.',
    preventionTips: [
      'Prune vines to ensure good air flow',
      'Avoid excessive nitrogen fertilization',
      'Plant in areas with good sun exposure'
    ]
  },
  {
    id: 4,
    name: 'Bacterial Spot',
    plant: 'Pepper',
    severity: 'high',
    confidence: 91,
    description: 'Bacterial spot is caused by several Xanthomonas species and can significantly reduce pepper yields.',
    symptoms: [
      'Small dark spots with yellow halos on leaves',
      'Raised spots on fruits',
      'Leaf yellowing and drop in severe cases'
    ],
    immediateAction: 'Remove and destroy infected plant parts. Avoid overhead watering.',
    organicCure: 'Apply copper hydroxide spray (1.5g/L) every 5-7 days during disease pressure.',
    chemicalCure: 'Use streptomycin sulfate or a combination of copper + mancozeb fungicide.',
    preventionTips: [
      'Use disease-free seeds and transplants',
      'Practice crop rotation with non-host crops',
      'Disinfect tools between plants'
    ]
  },
  {
    id: 5,
    name: 'Late Blight',
    plant: 'Potato',
    severity: 'high',
    confidence: 89,
    description: 'Late blight is a serious disease caused by Phytophthora infestans that can destroy entire potato crops.',
    symptoms: [
      'Water-soaked lesions on leaves',
      'White fungal growth on leaf undersides',
      'Rapid browning and death of plant tissue'
    ],
    immediateAction: 'Remove and destroy infected plants immediately. Do not compost infected material.',
    organicCure: 'Apply copper fungicide preventively during cool, wet weather. Use biofungicide Bacillus subtilis.',
    chemicalCure: 'Use Metalaxyl + Mancozeb combination or Cymoxanil-based fungicides.',
    preventionTips: [
      'Plant certified disease-free seed potatoes',
      'Avoid planting near tomatoes',
      'Destroy volunteer potato plants'
    ]
  },
  {
    id: 6,
    name: 'Anthracnose',
    plant: 'Mango',
    severity: 'medium',
    confidence: 87,
    description: 'Anthracnose is a fungal disease affecting mango flowers, leaves, and fruits during humid conditions.',
    symptoms: [
      'Black spots on leaves and fruits',
      'Flower blight during wet weather',
      'Premature fruit drop'
    ],
    immediateAction: 'Prune infected branches. Remove fallen leaves and fruits from the ground.',
    organicCure: 'Spray neem oil (2%) or garlic extract during flowering and fruiting stages.',
    chemicalCure: 'Apply Carbendazim (1g/L) or Copper Oxychloride (3g/L) before flowering.',
    preventionTips: [
      'Prune trees for better air circulation',
      'Harvest fruits at proper maturity',
      'Apply protective sprays before monsoon'
    ]
  }
];

export const getRandomDisease = (): Disease => {
  const randomIndex = Math.floor(Math.random() * diseases.length);
  // Add some variation to confidence
  const disease = { ...diseases[randomIndex] };
  disease.confidence = Math.floor(85 + Math.random() * 13); // 85-98%
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
