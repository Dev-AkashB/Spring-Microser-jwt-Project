@echo off
echo ===================================================================
echo   Starting Online Grocery Order Microservices Cluster (Spring Boot)
echo ===================================================================

echo [1/6] Launching Eureka Discovery Server (Port: 8761)...
start "Eureka Server [8761]" cmd /k "java -jar eureka-server\target\eureka-server-1.0.0.jar"

echo Waiting 10 seconds for Eureka Discovery Server to initialize...
timeout /t 10 /nobreak >nul

echo [2/6] Launching Auth & User Service (Port: 8081)...
start "Auth Service [8081]" cmd /k "java -jar auth-service\target\auth-service-1.0.0.jar"

echo [3/6] Launching Product & Catalog Service (Port: 8082)...
start "Product Service [8082]" cmd /k "java -jar product-service\target\product-service-1.0.0.jar"

echo [4/6] Launching Payment & Delivery Service (Port: 8084)...
start "Payment Service [8084]" cmd /k "java -jar payment-service\target\payment-service-1.0.0.jar"

echo [5/6] Launching Order & Cart Service (Port: 8083)...
start "Order Service [8083]" cmd /k "java -jar order-service\target\order-service-1.0.0.jar"

echo Waiting 6 seconds before launching API Gateway...
timeout /t 6 /nobreak >nul

echo [6/6] Launching API Gateway & Frontend (Port: 8080)...
start "API Gateway [8080]" cmd /k "java -jar api-gateway\target\api-gateway-1.0.0.jar"

echo ===================================================================
echo All microservices launched successfully!
echo - Web Storefront & Gateway : http://localhost:8080
echo - Eureka Service Registry  : http://localhost:8761
echo - Customer Demo Account    : john@example.com / customer123
echo - Admin Demo Account       : admin@grocery.com / admin123
echo ===================================================================
pause
