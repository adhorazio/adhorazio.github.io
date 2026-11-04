# Serve the site to this PC AND to phones on the same Wi-Fi.
# No Python, no admin rights needed. Works in Windows PowerShell 5.1.
# Usage (from the repo folder):
#   powershell -ExecutionPolicy Bypass -File .claude/serve-lan.ps1
# Stop with Ctrl+C.
param([int]$Port = 3000)

$root = (Resolve-Path (Split-Path $PSScriptRoot -Parent)).Path
$mime = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'; '.json' = 'application/json'
  '.svg'  = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'
  '.ico'  = 'image/x-icon'; '.xml' = 'application/xml'; '.txt' = 'text/plain; charset=utf-8'
}

# Windows reserves some port ranges (Hyper-V / WSL); try a few until one works
$listener = $null
foreach ($p in @($Port, 8080, 5500, 8000, 8888, 4173, 9000, 18080)) {
  try {
    $l = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $p)
    $l.Start()
    $listener = $l; $Port = $p
    break
  } catch {
    Write-Host "Port $p not available, trying another..."
  }
}
if (-not $listener) { Write-Host "No free port found. Try: -Port 12345"; exit 1 }

Write-Host ""
Write-Host "Serving $root"
Write-Host "  On this PC:     http://localhost:$Port"
try {
  Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop |
    Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
    ForEach-Object { Write-Host "  On your phone:  http://$($_.IPAddress):$Port" }
} catch { Write-Host "  On your phone:  http://<your PC IP>:$Port  (run: ipconfig)" }
Write-Host "Press Ctrl+C to stop."
Write-Host ""

try {
  while ($true) {
    # Poll so Ctrl+C stays responsive
    while (-not $listener.Pending()) { Start-Sleep -Milliseconds 50 }
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $stream.ReadTimeout = 5000
      $reader = New-Object System.IO.StreamReader($stream)
      $requestLine = $reader.ReadLine()
      if (-not $requestLine) { continue }
      while ($true) { $h = $reader.ReadLine(); if ($null -eq $h -or $h -eq '') { break } }

      $target = ($requestLine.Split(' '))[1]
      $path = [System.Uri]::UnescapeDataString(($target -split '\?')[0])
      if ($path.EndsWith('/')) { $path += 'index.html' }
      $file = [System.IO.Path]::GetFullPath((Join-Path $root $path.TrimStart('/')))

      if ($file.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase) -and
          (Test-Path -LiteralPath $file -PathType Leaf)) {
        $status = '200 OK'
        $body = [System.IO.File]::ReadAllBytes($file)
        $type = $mime[[System.IO.Path]::GetExtension($file).ToLower()]
        if (-not $type) { $type = 'application/octet-stream' }
      } else {
        $status = '404 Not Found'
        $body = [System.Text.Encoding]::UTF8.GetBytes('Not found')
        $type = 'text/plain'
      }

      $head = "HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($body.Length)`r`n" +
              "Cache-Control: no-cache`r`nConnection: close`r`n`r`n"
      $headBytes = [System.Text.Encoding]::ASCII.GetBytes($head)
      $stream.Write($headBytes, 0, $headBytes.Length)
      $stream.Write($body, 0, $body.Length)
      $stream.Flush()
      Write-Host "$status  $path"
    } catch {
      # a phone dropping the connection mid-request is harmless
    } finally {
      $client.Close()
    }
  }
} finally {
  $listener.Stop()
}
