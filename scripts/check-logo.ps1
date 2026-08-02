Add-Type -AssemblyName System.Drawing
foreach ($f in @('public/logo/nahhat-logo-black.png','public/logo/nahhat-logo-white.png')) {
    $img = [System.Drawing.Image]::FromFile((Resolve-Path $f))
    Write-Output "$f : $($img.Width)x$($img.Height) format=$($img.PixelFormat)"
    $img.Dispose()
}
