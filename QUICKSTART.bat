@echo off
REM Quick Start Script for SmartFood Vision (Windows)

echo.
echo 🍽️  SmartFood Vision - Quick Start
echo ==================================
echo.

echo ✓ Checking Node.js...
node --version

echo.
echo 📦 Installing dependencies...
echo.

echo → Frontend...
cd frontend
call npm install
cd ..

echo → Backend...
cd backend
call npm install
cd ..

echo → MCP Server...
cd mcp-server
call npm install
cd ..

echo.
echo ✅ Installation complete!
echo.
echo 📝 Next steps:
echo   1. Copy .env.example to .env in each directory
echo   2. Open 3 terminals and run:
echo      - Terminal 1: cd backend ^&^& npm run dev
echo      - Terminal 2: cd frontend ^&^& npm run dev
echo      - Terminal 3: cd mcp-server ^&^& npm run dev
echo   3. Open http://localhost:5173 in your browser
echo.
echo 🧪 To test MCP:
echo   cd mcp-server ^&^& npx @modelcontextprotocol/inspector npm run dev
echo.
pause
