import axios from "axios";
import { DetectedItem } from "../types/analysis.js";

export class AzureVisionService {
  private endpoint: string;
  private key: string;

  constructor(endpoint: string, key: string) {
    this.endpoint = endpoint.endsWith("/") ? endpoint : endpoint + "/";
    this.key = key;
  }

  async analyzeImageFromUrl(imageUrl: string): Promise<DetectedItem[]> {
    try {
      const url = `${this.endpoint}vision/v3.2/analyze?visualFeatures=Objects,Tags`;

      const response = await axios.post(
        url,
        { url: imageUrl },
        {
          headers: {
            "Ocp-Apim-Subscription-Key": this.key,
            "Content-Type": "application/json",
          },
        }
      );

      const detectedItems: DetectedItem[] = [];

      // Extract objects (more reliable for food items)
      if (response.data.objects && Array.isArray(response.data.objects)) {
        for (const obj of response.data.objects) {
          if (obj.object) {
            detectedItems.push({
              label: obj.object,
              confidence: obj.confidence || 0.5,
            });
          }
        }
      }

      // Also add tags if no objects detected
      if (response.data.tags && detectedItems.length === 0 && Array.isArray(response.data.tags)) {
        for (const tag of response.data.tags.slice(0, 5)) {
          if (tag.name) {
            detectedItems.push({
              label: tag.name,
              confidence: tag.confidence || 0.5,
            });
          }
        }
      }

      return detectedItems.length > 0 ? detectedItems : [
        { label: "Unknown food item", confidence: 0.5 }
      ];
    } catch (error) {
      console.error("Azure Vision API error:", error);
      throw new Error("Failed to analyze image with Azure Vision API");
    }
  }
}
