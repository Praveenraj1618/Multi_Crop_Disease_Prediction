import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ArrowLeft,
  Download,
  Volume2,
  MapPin,
  MessageSquare,
  ZoomIn,
  Activity,
  Leaf,
  TestTube,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Share2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Disease } from "../data/diseases";
import { motion } from "motion/react";
import { toast } from "sonner";

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const disease = location.state?.disease as Disease;
  const imageUrl = location.state?.image || "https://images.unsplash.com/photo-1664634099700-db6ebd2cbbda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNlYXNlZCUyMHBsYW50JTIwbGVhZiUyMGNsb3NlLXVwfGVufDF8fHx8MTc3NDk3NTY1OXww&ixlib=rb-4.1.0&q=80&w=1080";

  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  if (!disease) {
    navigate('/upload');
    return null;
  }

  const getSeverityData = (severity: string) => {
    switch (severity) {
      case 'high':
        return { percentage: 85, color: 'text-red-500', bgColor: 'bg-red-500', label: 'Critical Risk', icon: '🔥🔥🔥' };
      case 'medium':
        return { percentage: 55, color: 'text-orange-500', bgColor: 'bg-orange-500', label: 'Moderate Risk', icon: '🔥🔥' };
      default:
        return { percentage: 25, color: 'text-yellow-500', bgColor: 'bg-yellow-500', label: 'Low Risk', icon: '🔥' };
    }
  };

  const severityData = getSeverityData(disease.severity);

  const handleDownloadReport = () => {
    toast.success('Downloading Smart PDF Report...');
  };

  const handleVoiceOutput = () => {
    const text = `Disease detected: ${disease.plant} ${disease.name}. Confidence: ${disease.confidence} percent. Severity: ${disease.severity}. ${disease.immediateAction}`;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      toast.success('Playing audio instructions');
    } else {
      toast.error('Text-to-speech not supported');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/upload')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AI Analysis Results</h1>
                <p className="text-sm text-gray-600">Completed in 3.2 seconds</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast.success('Sharing...')}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Bottom Bar (Hidden on Desktop) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden z-30 shadow-lg">
          <div className="flex gap-2">
            <Button onClick={() => navigate('/upload')} className="flex-1" variant="outline">
              Scan Again
            </Button>
            <Button onClick={handleDownloadReport} className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20]">
              Download Report
            </Button>
          </div>
        </div>

        {/* Three-Zone Layout */}
        <div className="grid lg:grid-cols-12 gap-6 pb-24 md:pb-8">
          {/* LEFT ZONE: Image Analysis Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <Card className="sticky top-24 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#2E7D32]" />
                  Image Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Image with Detection */}
                <div className="relative rounded-lg overflow-hidden mb-4 group">
                  <img
                    src={imageUrl}
                    alt="Analyzed crop"
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Bounding Box Overlay */}
                  {showBoundingBox && (
                    <div className="absolute inset-[15%] border-4 border-[#2E7D32] rounded-lg shadow-[0_0_20px_rgba(46,125,50,0.6)] pointer-events-none">
                      <div className="absolute -top-8 left-0 bg-[#2E7D32] text-white px-3 py-1 rounded text-sm font-medium">
                        {disease.name}
                      </div>
                    </div>
                  )}

                  {/* Scanning Line */}
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_10px_rgba(34,197,94,0.8)] pointer-events-none"
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* Zoom Icon */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Full Image View</DialogTitle>
                      </DialogHeader>
                      <img src={imageUrl} alt="Full view" className="w-full" />
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Toggle Controls */}
                <div className="space-y-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowBoundingBox(!showBoundingBox)}
                  >
                    <CheckCircle className={`w-4 h-4 mr-2 ${showBoundingBox ? 'text-green-600' : 'text-gray-400'}`} />
                    Show Detection Boxes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                  >
                    <CheckCircle className={`w-4 h-4 mr-2 ${showHeatmap ? 'text-green-600' : 'text-gray-400'}`} />
                    Show Confidence Heatmap
                  </Button>
                </div>

                {/* Detection Stats */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Region Detected</span>
                    <span className="text-sm font-medium">Central Leaf Area</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Coverage</span>
                    <span className="text-sm font-medium">42% of leaf</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Image Quality</span>
                    <Badge className="bg-green-600">Excellent</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CENTER ZONE: Diagnosis Engine */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <Card className="shadow-lg border-2 border-[#2E7D32] mb-6">
              <CardContent className="p-6">
                {/* Disease Info */}
                <div className="mb-6">
                  <Badge className="mb-3 bg-[#2E7D32]">{disease.plant}</Badge>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {disease.name}
                  </h2>
                  <p className="text-sm text-gray-600 italic mb-4">
                    {disease.description}
                  </p>
                  
                  {/* Confidence Badge */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2"
                  >
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-900">
                      {disease.confidence}% Confidence
                    </span>
                  </motion.div>
                </div>

                {/* Severity Intelligence */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Severity Assessment
                  </h3>

                  {/* Radial Gauge */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                          fill="none"
                        />
                        <motion.circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke={severityData.bgColor.replace('bg-', 'currentColor')}
                          strokeWidth="12"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - severityData.percentage / 100) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={severityData.color}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl mb-1">{severityData.icon}</span>
                        <span className={`text-2xl font-bold ${severityData.color}`}>
                          {severityData.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className={`text-lg font-semibold ${severityData.color} mb-2`}>
                      {severityData.label}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>Spread Risk Indicator:</span>
                      <span>{severityData.icon}</span>
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Identified Symptoms</h3>
                  <ul className="space-y-2">
                    {disease.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* AI Confidence Breakdown */}
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="text-lg">AI Confidence Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Disease Match</span>
                      <span className="font-medium">{disease.confidence}%</span>
                    </div>
                    <Progress value={disease.confidence} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Image Quality</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Pattern Recognition</span>
                      <span className="font-medium">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT ZONE: Action Engine */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-4"
          >
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle>Treatment & Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="organic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4">
                    <TabsTrigger value="organic">
                      <Leaf className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Organic</span>
                    </TabsTrigger>
                    <TabsTrigger value="chemical">
                      <TestTube className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Chemical</span>
                    </TabsTrigger>
                    <TabsTrigger value="preventive">
                      <Shield className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Prevention</span>
                    </TabsTrigger>
                    <TabsTrigger value="impact">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Impact</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Organic Treatment Tab */}
                  <TabsContent value="organic" className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Leaf className="w-5 h-5" />
                        Organic Solution
                      </h4>
                      <p className="text-sm text-green-800 mb-3">
                        {disease.organicCure}
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-xs font-medium text-green-900 mb-1">Application Schedule:</p>
                        <ul className="text-xs text-green-800 space-y-1">
                          <li>• Day 1: Initial application</li>
                          <li>• Day 7: Second application</li>
                          <li>• Day 14: Follow-up treatment</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-amber-900 mb-1">Important Note</p>
                          <p className="text-xs text-amber-800">
                            {disease.immediateAction}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Chemical Treatment Tab */}
                  <TabsContent value="chemical" className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <TestTube className="w-5 h-5" />
                        Chemical Treatment
                      </h4>
                      <p className="text-sm text-blue-800 mb-3">
                        {disease.chemicalCure}
                      </p>
                      
                      <div className="bg-white rounded-lg p-3 border border-blue-200 mb-3">
                        <p className="text-xs font-medium text-blue-900 mb-2">Dosage Instructions:</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-blue-800">Concentration:</span>
                            <Badge variant="outline" className="text-blue-900">2g/L</Badge>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-blue-800">Spray Volume:</span>
                            <Badge variant="outline" className="text-blue-900">500ml/plant</Badge>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-blue-800">Frequency:</span>
                            <Badge variant="outline" className="text-blue-900">Every 10-14 days</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-red-900 mb-1">⚠️ Safety Precautions:</p>
                        <ul className="text-xs text-red-800 space-y-1">
                          <li>• Wear protective equipment</li>
                          <li>• Avoid spray during windy conditions</li>
                          <li>• Follow harvest interval guidelines</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Preventive Measures Tab */}
                  <TabsContent value="preventive" className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Future Prevention
                      </h4>
                      <ul className="space-y-3">
                        {disease.preventionTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-purple-800 bg-white rounded-lg p-3 border border-purple-200">
                            <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                              {index + 1}
                            </span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Crop Impact Tab */}
                  <TabsContent value="impact" className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Expected Impact
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-3 border border-orange-200">
                          <p className="text-sm font-medium text-orange-900 mb-2">Yield Impact (if untreated)</p>
                          <div className="flex items-center gap-3">
                            <Progress 
                              value={disease.severity === 'high' ? 70 : disease.severity === 'medium' ? 40 : 20} 
                              className="flex-1 h-3"
                            />
                            <span className="text-sm font-bold text-orange-900">
                              {disease.severity === 'high' ? '50-70%' : disease.severity === 'medium' ? '25-40%' : '10-25%'} loss
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <p className="text-sm font-medium text-green-900 mb-2">Recovery Timeline (with treatment)</p>
                          <ul className="text-xs text-green-800 space-y-1">
                            <li>• Week 1: Symptom stabilization</li>
                            <li>• Week 2-3: Visible improvement</li>
                            <li>• Week 4+: Near-complete recovery</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                onClick={handleDownloadReport}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] h-12"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handleVoiceOutput}
                variant="outline"
                className="h-12"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Voice Output
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12">
                    <MapPin className="w-4 h-4 mr-2" />
                    Find Stores
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nearby Agro Stores</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {[
                      { name: "Green Farm Supplies", distance: "2.3 km", rating: "4.5★" },
                      { name: "Agri Solutions Pro", distance: "3.8 km", rating: "4.7★" },
                      { name: "Crop Care Center", distance: "5.1 km", rating: "4.3★" },
                    ].map((store, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{store.name}</p>
                          <p className="text-sm text-gray-600">{store.distance} • {store.rating}</p>
                        </div>
                        <Button size="sm">Navigate</Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Get Expert Help
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Connect with Agricultural Expert</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Get personalized advice from certified agronomists
                    </p>
                    <div className="space-y-3">
                      {[
                        { name: "Dr. Rajesh Kumar", specialty: "Plant Pathology", available: true },
                        { name: "Dr. Priya Sharma", specialty: "Crop Management", available: true },
                        { name: "Dr. Anil Verma", specialty: "Integrated Pest Mgmt", available: false },
                      ].map((expert, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{expert.name}</p>
                            <p className="text-sm text-gray-600">{expert.specialty}</p>
                          </div>
                          <Button 
                            size="sm" 
                            disabled={!expert.available}
                            className="bg-[#2E7D32] hover:bg-[#1B5E20]"
                          >
                            {expert.available ? 'Chat' : 'Offline'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Recommended Action Timeline */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Recommended Action Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { day: "Day 1", action: "Remove infected leaves & apply first treatment", urgent: true },
                    { day: "Day 3", action: "Monitor spread and document progress", urgent: false },
                    { day: "Day 7", action: "Apply second treatment dose", urgent: false },
                    { day: "Day 14", action: "Final assessment and preventive measures", urgent: false },
                  ].map((timeline, i) => (
                    <div key={i} className={`flex gap-3 p-3 rounded-lg ${timeline.urgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${timeline.urgent ? 'bg-red-600' : 'bg-gray-400'} text-white font-bold text-sm`}>
                        {timeline.day.replace('Day ', '')}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${timeline.urgent ? 'text-red-900' : 'text-gray-900'}`}>
                          {timeline.day}
                        </p>
                        <p className={`text-xs ${timeline.urgent ? 'text-red-800' : 'text-gray-600'}`}>
                          {timeline.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
