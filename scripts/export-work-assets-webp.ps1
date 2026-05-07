# Exports optimized .webp next to PNG/JPG raster sources (ImageMagick).
#
# NOTE: Raster masters for collage + laptop shots may have been deleted after
# WebP validation. To re-export, restore PNG/JPG sources (e.g. from git history
# or originals folder) before running again.
$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$pub = Join-Path $repoRoot "public"

function Write-Webp {
  param(
    [Parameter(Mandatory)][string]$InputPath,
    [Parameter(Mandatory)][string]$Resize
  )
  if (-not (Test-Path -LiteralPath $InputPath)) {
    Write-Warning "Missing: $InputPath"
    return
  }
  $dir = Split-Path -Parent $InputPath
  $base = [System.IO.Path]::GetFileNameWithoutExtension($InputPath)
  $out = Join-Path $dir "$base.webp"
  & magick $InputPath `
    -strip `
    -resize $Resize `
    -quality 85 `
    -define webp:method=6 `
    $out
  Write-Host "OK $out"
}

# ── Laptop stills (Selected Works / video posters): already ~1600w — cap prevents future bloat ──
Get-ChildItem -Path (Join-Path $pub "assets/lap-animation-assets") -Filter "*.jpg" -File |
  ForEach-Object { Write-Webp $_.FullName "2000x2000>" }

# ── Phone wallpapers ──
Get-ChildItem -Path (Join-Path $pub "assets/phone-apps") -Filter "phone-wallpaper*.jpg" -File |
  ForEach-Object { Write-Webp $_.FullName "1440x1440>" }

# ── Papion receipt still ──
$receipt = Join-Path $pub "assets/papion-page/papion-screenshots/reciept-sample.jpg"
Write-Webp $receipt "1600x1600>"

# ── Case-study collage / Photos app screenshots ──
$shotResize = "1760x1760>"

$papionShots =
  Join-Path $pub "assets/papion-page/papion-screenshots/gen-*.png"
Get-ChildItem -Path $papionShots -File |
  ForEach-Object { Write-Webp $_.FullName $shotResize }

foreach ($suffix in @("mob-*.png", "ipad-*.png")) {
  Get-ChildItem -Path (Join-Path $pub "assets/papion-page/papion-screenshots") -Filter $suffix -File |
    ForEach-Object { Write-Webp $_.FullName $shotResize }
}

Get-ChildItem -Path (Join-Path $pub "assets/duwit-page/duwit-screenshots") -Filter "gen-*.png" -File |
  ForEach-Object { Write-Webp $_.FullName $shotResize }

Get-ChildItem -Path (Join-Path $pub "assets/twodo-page") -Filter "gen-*.png" -File |
  ForEach-Object { Write-Webp $_.FullName $shotResize }

Get-ChildItem -Path (Join-Path $pub "assets/ak-page") -Filter "gen-*.png" -File |
  ForEach-Object { Write-Webp $_.FullName $shotResize }

Write-Host "Done. Original JPG/PNG files are unchanged."
