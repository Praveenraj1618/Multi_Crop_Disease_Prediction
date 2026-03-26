export interface PredictionResponse {
    disease: string;
    confidence: number;
    severity: "Low" | "Medium" | "High";
    recommendation: string;
}

export const mockPredict = async (file: File): Promise<PredictionResponse> => {
    // Simulate network delay
    console.log("Analyzing file:", file.name);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    return {
        disease: "Rice_Blast",
        confidence: 0.92,
        severity: "Medium",
        recommendation: "Apply Tricyclazole fungicide"
    };
};
