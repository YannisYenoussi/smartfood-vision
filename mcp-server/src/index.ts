import dotenv from "dotenv";
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  ListToolsRequest,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Import tools
import {
  getApplicationCapabilitiesTool,
  executeGetCapabilities,
} from "./tools/capabilities.tool.js";
import {
  getSupportedImageFormatsTool,
  executeGetSupportedFormats,
} from "./tools/imageAnalysis.tool.js";
import {
  analyzeFoodImageTool,
  executeAnalyzeFoodImage,
} from "./tools/nutrition.tool.js";
import {
  estimateNutritionFromLabelsTool,
  executeEstimateNutrition,
} from "./tools/security.tool.js";
import {
  getSecurityPolicyTool,
  executeGetSecurityPolicy,
} from "./tools/policyTool.js";

// Create server instance
const server = new Server({
  name: "smartfood-vision",
  version: "1.0.0",
});

/**
 * List all available tools
 */
server.setRequestHandler(ListToolsRequest, async () => {
  const tools: Tool[] = [
    getApplicationCapabilitiesTool,
    getSupportedImageFormatsTool,
    analyzeFoodImageTool,
    estimateNutritionFromLabelsTool,
    getSecurityPolicyTool,
  ];

  return { tools };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequest, async (request) => {
  const { name, arguments: args } = request;

  try {
    let result: object;

    switch (name) {
      case "get_application_capabilities":
        result = executeGetCapabilities();
        break;

      case "get_supported_image_formats":
        result = executeGetSupportedFormats();
        break;

      case "analyze_food_image":
        result = await executeAnalyzeFoodImage(
          args as { imageUrl: string; language?: string }
        );
        break;

      case "estimate_nutrition_from_labels":
        result = executeEstimateNutrition(args as { foods: string[] });
        break;

      case "get_security_policy":
        result = executeGetSecurityPolicy();
        break;

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      content: [
        {
          type: "text",
          text: `Tool execution error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SmartFood Vision MCP server started");
}

main().catch(console.error);
