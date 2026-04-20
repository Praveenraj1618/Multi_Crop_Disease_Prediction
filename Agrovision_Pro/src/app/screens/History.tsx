import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Calendar, TrendingUp, AlertTriangle, CheckCircle, Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { mockScanHistory, ScanHistory } from "../data/diseases";
import { format } from "date-fns";
import { motion } from "motion/react";
import { toast } from "sonner";

export function History() {
  const navigate = useNavigate();
  const [historyDocs, setHistoryDocs] = useState<ScanHistory[]>(mockScanHistory);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('agrovision_scans');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistoryDocs([...parsed, ...mockScanHistory]);
      } else {
        setHistoryDocs(mockScanHistory);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearLocalHistory = () => {
    localStorage.removeItem('agrovision_scans');
    setHistoryDocs(mockScanHistory);
    toast.success("Local scan history cleared.");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'detected':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected':
        return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'healthy':
        return 'bg-green-100 text-green-900 border-green-200';
      default:
        return 'bg-yellow-100 text-yellow-900 border-yellow-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'detected':
        return 'Disease Detected';
      case 'healthy':
        return 'Healthy';
      default:
        return 'Uncertain';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Scan History
            </h1>
            <p className="text-white/80 text-lg">
              View your previous crop health analyses
            </p>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={clearLocalHistory}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {historyDocs.length}
              </div>
              <p className="text-white/70">Total Scans</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {historyDocs.filter(s => s.status === 'detected').length}
              </div>
              <p className="text-white/70">Issues Found</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">
                98%
              </div>
              <p className="text-white/70">Avg Accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {historyDocs.map((scan, index) => (
            <motion.div
              key={scan.id + index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index * 0.1, 1) }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Image Thumbnail (if available) */}
                    {scan.imageUrl ? (
                       <img src={scan.imageUrl} alt="Scan thumbnail" className="w-16 h-16 object-cover rounded-lg border-2 border-white/20" />
                    ) : (
                      <div className="bg-white/20 backdrop-blur-sm w-16 h-16 flex items-center justify-center rounded-lg group-hover:bg-white/30 transition-all">
                        {getStatusIcon(scan.status)}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">
                          {scan.disease.plant} - {scan.disease.name}
                        </h3>
                        <Badge className={`${getStatusColor(scan.status)} border`}>
                          {getStatusLabel(scan.status)}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-900 border-blue-200">
                          {scan.disease.severity === 'high' ? 'High Risk' : scan.disease.severity === 'medium' ? 'Moderate' : 'Low Risk'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(scan.date), 'MMM dd, yyyy • HH:mm')}
                        </div>
                        <div>
                          AI Confidence: {scan.disease.confidence}%
                        </div>
                      </div>
                    </div>

                    {/* View Button */}
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                      onClick={() => navigate('/results', { state: { disease: scan.disease, image: scan.imageUrl } })}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State Message */}
        {historyDocs.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <div className="text-white/50 mb-4">
                <Calendar className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl font-medium">No scan history yet</p>
                <p className="text-sm mt-2">Start your first crop analysis to see results here</p>
              </div>
              <Button
                onClick={() => navigate('/upload')}
                className="bg-white text-[#2E7D32] hover:bg-white/90 mt-4"
              >
                Start First Scan
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
