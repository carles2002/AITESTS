# empaquetar-extension.ps1
# Script para empaquetar la extension Claude Sync como archivo .xpi

param(
    [string]$ExtensionDir = "extension",
    [string]$OutputXpi = "claude-sync.xpi"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Empaquetador de Extension Claude Sync" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que existe la carpeta extension
if (-not (Test-Path $ExtensionDir)) {
    Write-Host "Error: No se encontro la carpeta '$ExtensionDir'" -ForegroundColor Red
    Write-Host "  Por favor, ejecuta este script desde la carpeta raiz del proyecto AITRACKER" -ForegroundColor Yellow
    exit 1
}

# Verificar que existe manifest.json
$manifestPath = Join-Path $ExtensionDir "manifest.json"
if (-not (Test-Path $manifestPath)) {
    Write-Host "Error: No se encontro manifest.json en '$ExtensionDir'" -ForegroundColor Red
    exit 1
}

# Eliminar .xpi anterior si existe
if (Test-Path $OutputXpi) {
    Write-Host "[1/3] Eliminando archivo .xpi anterior..." -ForegroundColor Yellow
    Remove-Item $OutputXpi -Force
    Write-Host "  - Archivo anterior eliminado" -ForegroundColor Green
}

# Crear archivo ZIP
Write-Host "[2/3] Empaquetando extension..." -ForegroundColor Yellow

# Primero crear .zip temporal
$tempZip = "claude-sync-temp.zip"
Compress-Archive -Path "$ExtensionDir\*" -DestinationPath $tempZip -Force

if (-not (Test-Path $tempZip)) {
    Write-Host "  Error al crear archivo temporal" -ForegroundColor Red
    exit 1
}

# Renombrar a .xpi
Move-Item $tempZip $OutputXpi -Force

if (-not (Test-Path $OutputXpi)) {
    Write-Host "  Error al renombrar a .xpi" -ForegroundColor Red
    exit 1
}

Write-Host "  - Extension empaquetada exitosamente" -ForegroundColor Green

# Mostrar informacion del archivo generado
Write-Host "[3/3] Verificando archivo generado..." -ForegroundColor Yellow

$xpiFile = Get-Item $OutputXpi
$sizeKB = [math]::Round($xpiFile.Length / 1KB, 2)

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  EXTENSION EMPAQUETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Archivo:  $($xpiFile.FullName)" -ForegroundColor Cyan
Write-Host "  Tamano:   $sizeKB KB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Arrastra $OutputXpi al navegador (Firefox/Zen)" -ForegroundColor White
Write-Host "  2. Confirma la instalacion" -ForegroundColor White
Write-Host "  3. Ve a about:addons para verificar" -ForegroundColor White
Write-Host ""
