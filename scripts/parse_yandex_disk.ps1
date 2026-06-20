Add-Type -AssemblyName System.Drawing

$csvPath = "c:\Users\ilyas\Documents\skayfom\catalog_template.csv"
$targetDir = "c:\Users\ilyas\Documents\skayfom\public\images\catalog"
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

$pubKey = [uri]::EscapeDataString('https://disk.yandex.ru/d/By6eTs2FiaekNA')
$subPath = '/%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8%20%D0%B2%D0%BA%D1%83%D1%81%D0%BE%D0%B2%20%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D0%B2%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%BE%D1%86%D1%81%D0%B5%D1%82%D0%B5%D0%B9/png/%D0%B2%D1%81%D0%B5%20%D0%B2%D0%BA%D1%83%D1%81%D1%8B%20%D1%81%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC'
$url = "https://cloud-api.yandex.net/v1/disk/public/resources?public_key=$pubKey&path=$subPath&limit=1000"

Write-Output "Fetching file list from Yandex Disk..."
$response = Invoke-RestMethod -Uri $url

$files = $response._embedded.items | Where-Object { $_.type -eq 'file' }
Write-Output "Found $($files.Count) files."

# Load CSV
$csvContent = Get-Content $csvPath -Encoding UTF8
$header = $csvContent[0] -split ","

$idIdx = [array]::IndexOf($header, "id")
$flavorIdx = [array]::IndexOf($header, "flavor")
$mediaUrlIdx = [array]::IndexOf($header, "media_url")

$matchCount = 0

foreach ($file in $files) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.name).ToLower()
    $normName = $baseName -replace "[^\p{L}\p{N}]", ""
    if ($normName.Length -lt 3) { continue }
    
    # find matching row in CSV
    $matchedRowIdx = -1
    for ($i = 1; $i -lt $csvContent.Length; $i++) {
        $line = $csvContent[$i].Trim()
        if ($line.Length -eq 0) { continue }
        $cols = $line -split ","
        $flavor = $cols[$flavorIdx].Trim()
        $normFlavor = $flavor.ToLower() -replace "[^\p{L}\p{N}]", ""
        
        if ($normFlavor -eq $normName -or ($normName.Length -ge 4 -and $normFlavor.Contains($normName)) -or ($normFlavor.Length -ge 4 -and $normName.Contains($normFlavor))) {
            $matchedRowIdx = $i
            break
        }
    }
    
    if ($matchedRowIdx -gt 0) {
        $cols = $csvContent[$matchedRowIdx] -split ","
        $id = $cols[$idIdx].Trim()
        $targetFilename = "$id.jpg"
        $targetPath = Join-Path $targetDir $targetFilename
        
        Write-Output "Downloading $($file.name) -> ID $id..."
        $tempPath = Join-Path $env:TEMP $file.name
        $wc = New-Object System.Net.WebClient
        $wc.DownloadFile($file.file, $tempPath)
        
        # Compress
        try {
            $bmp = [System.Drawing.Image]::FromFile($tempPath)
            
            # Remove transparency by filling with white background
            $newBmp = New-Object System.Drawing.Bitmap([int]$bmp.Width, [int]$bmp.Height)
            $g = [System.Drawing.Graphics]::FromImage($newBmp)
            $g.Clear([System.Drawing.Color]::White)
            $g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
            $g.Dispose()
            
            $bmp.Dispose()
            $bmp = $newBmp
            
            $maxSize = 600
            $width = $bmp.Width
            $height = $bmp.Height
            if ($width -gt $maxSize -or $height -gt $maxSize) {
                if ($width -gt $height) {
                    $height = [math]::Round($height * $maxSize / $width)
                    $width = $maxSize
                } else {
                    $width = [math]::Round($width * $maxSize / $height)
                    $height = $maxSize
                }
                $scaledBmp = New-Object System.Drawing.Bitmap([int]$width, [int]$height)
                $g2 = [System.Drawing.Graphics]::FromImage($scaledBmp)
                $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $g2.DrawImage($bmp, 0, 0, [int]$width, [int]$height)
                $g2.Dispose()
                
                $bmp.Dispose()
                $bmp = $scaledBmp
            }
            
            $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageDecoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 80L)
            
            $bmp.Save($targetPath, $jpegCodec, $encoderParams)
            $bmp.Dispose()
            Remove-Item $tempPath -Force
            
            $cols[$mediaUrlIdx] = "images/catalog/$targetFilename"
            $csvContent[$matchedRowIdx] = $cols -join ","
            $matchCount++
        } catch {
            Write-Output "Error processing $($file.name): $_"
        }
    }
}

$csvContent | Set-Content $csvPath -Encoding UTF8
Write-Output "Successfully downloaded, compressed, and matched $matchCount images."
