@echo off

echo Cleaning up existing processes on ports 8081, 5173, and 11434...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :11434 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo Waiting a moment for ports to free up...
timeout /t 2 /nobreak > nul

echo Starting LocalForge AI Services...

start /min "Ollama Server" cmd /k "ollama serve"
start /min "LocalForge Backend" cmd /k "cd backend && mvn spring-boot:run"
start /min "LocalForge Frontend" cmd /k "npm run dev"

echo Waiting a few seconds for services to initialize...
timeout /t 5 /nobreak > nul

echo Opening browser...
start http://localhost:5173

echo All services have been launched in separate minimized windows!
