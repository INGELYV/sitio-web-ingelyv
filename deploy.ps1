# =============================================================
# DEPLOY SCRIPT - INGELYV SPA Website
# Sube todos los archivos del sitio web a Web Host Chile via FTP
# =============================================================

param(
    [switch]$All,
    [string[]]$Files
)

$ftpUser = "deploy@ingelyv.cl"
$ftpPass = "Deploy2026!"
$ftpHost = "ftp://ftp.ingelyv.cl"
$srcDir = "c:\Proyectos\EMPRESARIAL\SITIO WEB INGELYV SPA"

$ErrorActionPreference = "Continue"

function Upload-File {
    param(
        [string]$LocalPath,
        [string]$RemotePath
    )
    
    $fullLocal = Join-Path $srcDir $LocalPath
    if (-not (Test-Path $fullLocal)) {
        Write-Host "  [ERROR] No existe: $LocalPath" -ForegroundColor Red
        return $false
    }
    
    $encodedRemote = $RemotePath -replace ' ', '%20'
    $url = "$ftpHost/$encodedRemote"
    
    Write-Host "  Subiendo $LocalPath ... " -NoNewline
    curl.exe --ftp-create-dirs -T "$fullLocal" "$url" --user "${ftpUser}:${ftpPass}" --connect-timeout 15 -s 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK]" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[FALLO]" -ForegroundColor Red
        return $false
    }
}

# Lista de todos los archivos del sitio
$allFiles = @(
    @{ Local = "index.html";                                    Remote = "index.html" },
    @{ Local = "servicios.html";                                Remote = "servicios.html" },
    @{ Local = "nosotros.html";                                 Remote = "nosotros.html" },
    @{ Local = "contacto.html";                                 Remote = "contacto.html" },
    @{ Local = "css\styles.css";                                Remote = "css/styles.css" },
    @{ Local = "js\main.js";                                    Remote = "js/main.js" },
    @{ Local = "Logo INGELYV SPA.png";                          Remote = "Logo INGELYV SPA.png" },
    @{ Local = "img\ecosistema-ingelyv.png";                    Remote = "img/ecosistema-ingelyv.png" },
    @{ Local = "Profe German Camisa Azul sin Lentes.jpg";       Remote = "Profe German Camisa Azul sin Lentes.jpg" },
    @{ Local = "Igor Labbe Sepulveda INGELYV.jpg";              Remote = "Igor Labbe Sepulveda INGELYV.jpg" },
    @{ Local = "qr_whatsapp_INGELYV.png";                       Remote = "qr_whatsapp_INGELYV.png" }
)

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY - INGELYV SPA Website" -ForegroundColor Cyan
Write-Host "  Servidor: ftp.ingelyv.cl" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$success = 0
$failed = 0

if ($Files -and $Files.Count -gt 0) {
    # Subir solo archivos especificos
    Write-Host "Subiendo archivos seleccionados:" -ForegroundColor Yellow
    foreach ($file in $Files) {
        $match = $allFiles | Where-Object { $_.Local -like "*$file*" -or $_.Remote -like "*$file*" }
        if ($match) {
            foreach ($m in $match) {
                if (Upload-File -LocalPath $m.Local -RemotePath $m.Remote) { $success++ } else { $failed++ }
            }
        } else {
            # Intentar subir directamente
            $remotePath = $file -replace '\\', '/'
            if (Upload-File -LocalPath $file -RemotePath $remotePath) { $success++ } else { $failed++ }
        }
    }
} else {
    # Subir todos los archivos
    Write-Host "Subiendo TODOS los archivos:" -ForegroundColor Yellow
    foreach ($f in $allFiles) {
        if (Upload-File -LocalPath $f.Local -RemotePath $f.Remote) { $success++ } else { $failed++ }
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Resultado: $success exitosos, $failed fallidos" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
Write-Host "  Sitio: https://ingelyv.cl" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
