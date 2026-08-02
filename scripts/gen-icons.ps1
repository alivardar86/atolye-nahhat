Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$logoPath = Join-Path $root "public\logo\nahhat-logo-black.png"
$paper = [System.Drawing.Color]::FromArgb(255, 0xFA, 0xFA, 0xF8)

$logo = [System.Drawing.Image]::FromFile($logoPath)

function New-Composite($size, $paddingFraction) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear($paper)

    $box = $size * (1 - $paddingFraction)
    $scale = [Math]::Min($box / $logo.Width, $box / $logo.Height)
    $w = $logo.Width * $scale
    $h = $logo.Height * $scale
    $x = ($size - $w) / 2
    $y = ($size - $h) / 2
    $g.DrawImage($logo, $x, $y, $w, $h)
    $g.Dispose()
    return $bmp
}

# icon.png — 512x512, used as the primary favicon by modern browsers
$icon512 = New-Composite 512 0.24
$icon512.Save((Join-Path $root "app\icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$icon512.Dispose()

# apple-icon.png — 180x180, Apple touch icon
$apple180 = New-Composite 180 0.20
$apple180.Save((Join-Path $root "app\apple-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$apple180.Dispose()

# favicon.ico — 32x32 single-resolution ICO for legacy browser tab icon
$fav32 = New-Composite 32 0.14
$hicon = $fav32.GetHicon()
$ico = [System.Drawing.Icon]::FromHandle($hicon)
$stream = [System.IO.File]::Open((Join-Path $root "app\favicon.ico"), [System.IO.FileMode]::Create)
$ico.Save($stream)
$stream.Close()
$ico.Dispose()
$fav32.Dispose()

$logo.Dispose()
Write-Output "Done: app/icon.png, app/apple-icon.png, app/favicon.ico"
