import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { default: app } = await import("./app.js");

const PORT = parseInt(process.env.PORT || "3001", 10);

app.listen(PORT, () => {
  console.log(`\n🍽️  SmartFood Vision Backend`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: GET http://localhost:${PORT}/api/health`);
  console.log(`🖼️  Analyze image: POST http://localhost:${PORT}/api/analyze\n`);
});
