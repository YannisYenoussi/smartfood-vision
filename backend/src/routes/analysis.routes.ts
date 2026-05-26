import { Router, Request, Response, NextFunction } from "express";
import { AzureVisionService } from "../services/azureVision.service.js";
import { MockVisionService } from "../services/mockVision.service.js";
import { NutritionService } from "../services/nutrition.service.js";
import { AnalysisResponse, AnalysisError } from "../types/analysis.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// Initialize services
const mockVisionService = new MockVisionService();
const nutritionService = new NutritionService();

// Determine if Azure Vision is configured
const hasAzureConfig =
  process.env.AZURE_VISION_ENDPOINT && process.env.AZURE_VISION_KEY;
let azureVisionService: AzureVisionService | null = null;

if (hasAzureConfig) {
  azureVisionService = new AzureVisionService(
    process.env.AZURE_VISION_ENDPOINT!,
    process.env.AZURE_VISION_KEY!
  );
  console.log("✓ Azure Vision configured");
} else {
  console.log("⚠ Azure Vision not configured - using mock mode");
}

/**
 * Validate image URL format
 */
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Check if it has a valid protocol
    if (!urlObj.protocol.match(/^https?:/)) {
      return false;
    }
    // Check if it looks like an image
    const pathname = urlObj.pathname.toLowerCase();
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(pathname) || url.includes("image");
  } catch {
    return false;
  }
}

/**
 * POST /api/analyze
 * Analyze a food image from URL
 */
router.post(
  "/analyze",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageUrl } = req.body;

      // Validation
      if (!imageUrl || typeof imageUrl !== "string") {
        throw new AppError(
          "imageUrl is required and must be a string",
          400,
          "INVALID_INPUT"
        );
      }

      if (!isValidImageUrl(imageUrl)) {
        throw new AppError(
          "imageUrl must be a valid HTTP(S) URL to an image file",
          400,
          "INVALID_URL"
        );
      }

      // Analyze image
      let detectedItems;
      let source: "azure" | "mock";

      if (azureVisionService) {
        try {
          detectedItems = await azureVisionService.analyzeImageFromUrl(imageUrl);
          source = "azure";
        } catch (error) {
          console.warn("Azure Vision failed, falling back to mock:", error);
          detectedItems = await mockVisionService.analyzeImageFromUrl(imageUrl);
          source = "mock";
        }
      } else {
        detectedItems = await mockVisionService.analyzeImageFromUrl(imageUrl);
        source = "mock";
      }

      // Estimate nutrition
      const nutrition = nutritionService.estimateNutrition(detectedItems);
      const summary = nutritionService.generateSummary(detectedItems);
      const warning = nutritionService.getWarning();

      const response: AnalysisResponse = {
        success: true,
        source,
        detectedItems,
        nutrition,
        summary,
        warning,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
