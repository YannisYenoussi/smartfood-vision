import { z } from "zod";

/**
 * Validation schemas for MCP tool inputs
 */

// Image URL validation
export const imageUrlSchema = z.object({
  imageUrl: z
    .string()
    .url("Must be a valid URL")
    .regex(/\.(jpg|jpeg|png|webp|gif)$/i, "Must be a valid image URL")
    .max(2000, "URL too long"),
});

// Language validation
const languageSchema = z.enum(["fr", "en"]).default("fr");

// Food image analysis schema
export const analyzeFoodImageSchema = z.object({
  imageUrl: imageUrlSchema.shape.imageUrl,
  language: languageSchema.optional(),
});

// Food list for nutrition estimation
export const foodListSchema = z.object({
  foods: z
    .array(z.string().min(1).max(100))
    .min(1, "Must provide at least one food item")
    .max(20, "Maximum 20 food items"),
});

/**
 * Sanitize user input to prevent prompt injection
 */
export function sanitizeInput(input: string): string {
  // Remove control characters
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, "");

  // Limit length
  sanitized = sanitized.substring(0, 500);

  // Remove potential command injection patterns
  sanitized = sanitized.replace(/[;`$(){}[\]<>|&]/g, "");

  return sanitized.trim();
}

/**
 * Validate and sanitize food item names
 */
export function sanitizeFoodName(name: string): string {
  const sanitized = sanitizeInput(name);
  // Remove numbers and special characters typically used in injection attempts
  return sanitized.replace(/[0-9!@#%^&*]/g, "").trim();
}
