import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Tool: get_supported_image_formats
 * Type: Exploration
 * Description: Lists accepted image formats and related specifications
 */
export const getSupportedImageFormatsTool: Tool = {
  name: "get_supported_image_formats",
  description:
    "Lists the image formats accepted by SmartFood Vision, maximum recommended file sizes, and quality tips for best results.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export function executeGetSupportedFormats(): object {
  return {
    supported_formats: [
      {
        format: "JPG/JPEG",
        extension: ".jpg, .jpeg",
        quality: "Good compression, widely supported",
        recommended_use: "Photo uploads from camera",
      },
      {
        format: "PNG",
        extension: ".png",
        quality: "Lossless compression, transparency support",
        recommended_use: "Screenshots, graphics",
      },
      {
        format: "WebP",
        extension: ".webp",
        quality: "Modern format, excellent compression",
        recommended_use: "Web optimized images",
      },
      {
        format: "GIF",
        extension: ".gif",
        quality: "Limited colors, animation support",
        recommended_use: "Simple graphics only",
      },
    ],
    file_size_recommendations: {
      minimum_width_pixels: 200,
      minimum_height_pixels: 200,
      recommended_width_pixels: 800,
      recommended_height_pixels: 600,
      maximum_url_length: 2000,
      note: "File size is not strictly limited, but smaller files process faster",
    },
    quality_tips: [
      "Use good lighting to capture food clearly",
      "Ensure the main food items are in focus",
      "Avoid extreme angles or distortions",
      "Include food composition in the frame",
      "Use high-resolution images for better accuracy",
      "Avoid very compressed or degraded images",
    ],
    technical_specifications: {
      color_support: "Full color (RGB, RGBA)",
      alpha_channel: "Supported where applicable",
      metadata: "Can be ignored by analyzer",
      urls: "Must be publicly accessible HTTP/HTTPS",
      cors: "Handled by backend service",
    },
  };
}
