@echo off
echo Stopping all Grocery Microservices on ports 8761, 8080, 8081, 8082, 8083, 8084...
powershell -ExecutionPolicy Bypass -File "%~dp0stop-all.ps1"
echo Finished.
pause
