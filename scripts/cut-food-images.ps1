Add-Type -AssemblyName System.Drawing

function Remove-GreenBackground {
  param([System.Drawing.Bitmap]$Source)

  $width = $Source.Width
  $height = $Source.Height
  $result = New-Object System.Drawing.Bitmap $width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb

  $srcData = $Source.LockBits(
    (New-Object System.Drawing.Rectangle 0, 0, $width, $height),
    [System.Drawing.Imaging.ImageLockMode]::ReadOnly,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )
  $dstData = $result.LockBits(
    (New-Object System.Drawing.Rectangle 0, 0, $width, $height),
    [System.Drawing.Imaging.ImageLockMode]::WriteOnly,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )

  $bytes = [Math]::Abs($srcData.Stride) * $height
  $srcBuffer = New-Object byte[] $bytes
  $dstBuffer = New-Object byte[] $bytes
  [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcBuffer, 0, $bytes)

  for ($i = 0; $i -lt $bytes; $i += 4) {
    $b = $srcBuffer[$i]
    $g = $srcBuffer[$i + 1]
    $r = $srcBuffer[$i + 2]
    $isGreenBg = ($g -gt 165) -and ($g -ge ($r - 18)) -and ($g -ge ($b - 18)) -and ([Math]::Abs($r - $b) -lt 35)
    if ($isGreenBg) {
      $dstBuffer[$i + 3] = 0
    } else {
      $dstBuffer[$i] = $b
      $dstBuffer[$i + 1] = $g
      $dstBuffer[$i + 2] = $r
      $dstBuffer[$i + 3] = 255
    }
  }

  [System.Runtime.InteropServices.Marshal]::Copy($dstBuffer, 0, $dstData.Scan0, $bytes)
  $Source.UnlockBits($srcData)
  $result.UnlockBits($dstData)
  return $result
}

function Export-Crop {
  param(
    [System.Drawing.Image]$Ref,
    [int]$X, [int]$Y, [int]$W, [int]$H,
    [string]$Out
  )

  $crop = New-Object System.Drawing.Bitmap $W, $H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  $g = [System.Drawing.Graphics]::FromImage($crop)
  $g.DrawImage($Ref, 0, 0, (New-Object System.Drawing.Rectangle $X, $Y, $W, $H), [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()

  $clean = Remove-GreenBackground $crop
  $crop.Dispose()
  $clean.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
  $clean.Dispose()
}

$base = "c:\Users\ASUS\OneDrive\Documents(1)\coding\thebiryanistore\public\brand"
$refPath = Join-Path $base "welcome-reference.jpg"
$ref = [System.Drawing.Image]::FromFile($refPath)

Export-Crop -Ref $ref -X 0 -Y 790 -W 290 -H 234 -Out (Join-Path $base "food-biryani.png")
Export-Crop -Ref $ref -X 210 -Y 800 -W 263 -H 224 -Out (Join-Path $base "food-sides.png")

$ref.Dispose()
Write-Host "Saved transparent food PNGs"
