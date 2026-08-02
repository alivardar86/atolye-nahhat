Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$logoPath = Join-Path $root "public\logo\nahhat-logo-white.png"
$ink = [System.Drawing.Color]::FromArgb(255, 0x17, 0x19, 0x1A)

$logo = [System.Drawing.Image]::FromFile($logoPath)

$w = 1200
$h = 630
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear($ink)

$boxW = $w * 0.55
$boxH = $h * 0.55
$scale = [Math]::Min($boxW / $logo.Width, $boxH / $logo.Height)
$lw = $logo.Width * $scale
$lh = $logo.Height * $scale
$x = ($w - $lw) / 2
$y = ($h - $lh) / 2
$g.DrawImage($logo, $x, $y, $lw, $lh)
$g.Dispose()

$bmp.Save((Join-Path $root "app\opengraph-image.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$logo.Dispose()
Write-Output "Done: app/opengraph-image.png"
