# Stop All Grocery Microservices Processes
$ports = @(8761, 8080, 8081, 8082, 8083, 8084)

Write-Host "Finding and stopping processes on ports: $($ports -join ', ')..." -ForegroundColor Yellow

foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($conn in $connections) {
                $processId = $conn.OwningProcess
                if ($processId -and $processId -ne 0) {
                    $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
                    if ($proc) {
                        Write-Host "Stopping $($proc.ProcessName) (PID: $processId) on port $port..." -ForegroundColor Cyan
                        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    }
                }
            }
        }
    } catch {
        # Ignore
    }
}

Write-Host "All specified grocery microservices stopped successfully." -ForegroundColor Green
