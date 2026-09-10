# Start All Grocery Microservices PowerShell Script
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  Starting Online Grocery Order Microservices Cluster (Spring Boot)" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Cyan

Write-Host "[1/6] Starting Eureka Discovery Server (Port: 8761)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList '/k', 'java -jar eureka-server\target\eureka-server-1.0.0.jar'

Write-Host "Waiting 10 seconds for Eureka Discovery Server to initialize..." -ForegroundColor DarkGray
Start-Sleep -Seconds 10

Write-Host "[2/6] Starting Auth & User Service (Port: 8081)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList '/k', 'java -jar auth-service\target\auth-service-1.0.0.jar'

Write-Host "[3/6] Starting Product & Catalog Service (Port: 8082)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList '/k', 'java -jar product-service\target\product-service-1.0.0.jar'

Write-Host "[4/6] Starting Payment & Delivery Service (Port: 8084)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList '/k', 'java -jar payment-service\target\payment-service-1.0.0.jar'

Write-Host "[5/6] Starting Order & Cart Service (Port: 8083)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList '/k', 'java -jar order-service\target\order-service-1.0.0.jar'

Write-Host "Waiting 6 seconds before starting API Gateway..." -ForegroundColor DarkGray
Start-Sleep -Seconds 6

Write-Host "[6/6] Starting API Gateway & Frontend (Port: 8080)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList '/k', 'java -jar api-gateway\target\api-gateway-1.0.0.jar'

Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "All microservices launched!" -ForegroundColor Green
Write-Host "  - Web Storefront & Gateway : http://localhost:8080" -ForegroundColor White
Write-Host "  - Eureka Service Registry  : http://localhost:8761" -ForegroundColor White
Write-Host "  - Customer Demo Account    : john@example.com / customer123" -ForegroundColor White
Write-Host "  - Admin Demo Account       : admin@grocery.com / admin123" -ForegroundColor White
Write-Host "===================================================================" -ForegroundColor Cyan
