$mapping = @{
    "ananasshock.png" = "524"
    "appleshock.png" = "537"
    "asianlychee.png" = "136"
    "barberryshock.png" = "122"
    "berrylemonade.png" = "517"
    "blackcola-txt.png" = "501"
    "brownie.png" = "535"
    "canemint.png" = "516"
    "cherrygarden.png" = "506"
    "chupagraper.png" = "505"
    "elka.png" = "533"
    "etalonmelon.png" = "502"
    "grapefruit-txt.png" = "525"
    "haribon.png" = "117"
    "iceberg.png" = "137"
    "juicysmoothie.png" = "526"
    "lemonshock.png" = "522"
    "lemonsweets.png" = "508"
    "malibu.png" = "507"
    "mirinda-txt.png" = "540"
    "peach yogurt 2.png" = "539"
    "peachberry.png" = "543"
    "peachkiller.png" = "527"
    "photo-pineappleyogurt-txt.png" = "503"
    "pistachioicesnow.png" = "538"
    "pomelo txt.png" = "709"
    "raspberries.png" = "504"
    "realpf.png" = "512"
    "red kiwi 2.png" = "511"
    "redenergy-txt.png" = "1410"
    "risingstar.png" = "518"
    "siberiansoda.png" = "520"
    "somethingberry.png" = "532"
    "somethingtropical.png" = "510"
    "strawberry coconut.png" = "528"
    "strawberryjam.png" = "530"
    "summerbasket.png" = "513"
    "sundaysun.png" = "523"
    "tiktak.png" = "545"
    "overdose.png" = "509"
    "epicyogurt.png" = "121"
}

$csvPath = "catalog_template.csv"
$csvContent = Get-Content $csvPath -Encoding UTF8
$header = $csvContent[0] -split ","
$mediaUrlIdx = [array]::IndexOf($header, "media_url")
$flavorIdx = [array]::IndexOf($header, "flavor")

# Add exact match from CSV
for ($i = 1; $i -lt $csvContent.Count; $i++) {
    if ([string]::IsNullOrWhiteSpace($csvContent[$i])) { continue }
    $cols = $csvContent[$i] -split ","
    if ($cols.Length -gt $flavorIdx) {
        $id = $cols[0]
        $flavor = $cols[$flavorIdx]
        $cleanFlavor = $flavor -replace '\s+', ''
        $filename = "$cleanFlavor.png"
        $mapping[$filename.ToLower()] = $id
        
        $flavorTxt = "$cleanFlavor txt.png"
        $mapping[$flavorTxt.ToLower()] = $id
        
        $flavorDashTxt = "$cleanFlavor-txt.png"
        $mapping[$flavorDashTxt.ToLower()] = $id
    }
}

$pubKey = [uri]::EscapeDataString('https://disk.yandex.ru/d/By6eTs2FiaekNA')
$subPath = '/%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8%20%D0%B2%D0%BA%D1%83%D1%81%D0%BE%D0%B2%20%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D0%B2%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%BE%D1%86%D1%81%D0%B5%D1%82%D0%B5%D0%B9/png/%D0%B2%D1%81%D0%B5%20%D0%B2%D0%BA%D1%83%D1%81%D1%8B%20%D1%81%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC'
$url = "https://cloud-api.yandex.net/v1/disk/public/resources?public_key=$pubKey&path=$subPath&limit=1000"

Write-Output "Fetching file list from Yandex Disk..."
$response = Invoke-RestMethod -Uri $url
$files = $response._embedded.items | Where-Object { $_.type -eq 'file' }
Write-Output "Found $($files.Count) files."

Add-Type -AssemblyName System.Drawing
$targetFolder = "public/images/catalog"
if (-not (Test-Path $targetFolder)) {
    New-Item -ItemType Directory -Path $targetFolder | Out-Null
}

$successCount = 0

foreach ($file in $files) {
    $lowerName = $file.name.ToLower()
    # Add custom manual mappings that were found during phase 1
    if ($lowerName -eq "ekzomango.png") { $id = "818" }
    elseif ($lowerName -eq "icebaby.png") { $id = "541" }
    elseif ($lowerName -eq "melonhalls.png") { $id = "1009" }
    elseif ($lowerName -eq "pineapple.png") { $id = "808" }
    elseif ($lowerName -eq "raspberry-shock txt.png") { $id = "1011" }
    elseif ($lowerName -eq "skittles txt.png") { $id = "110" }
    elseif ($mapping.ContainsKey($lowerName)) {
        $id = $mapping[$lowerName]
    } else {
        continue
    }

    $targetFilename = "$id.png"
    $targetPath = Join-Path $targetFolder $targetFilename
    
    Write-Output "Downloading $($file.name) -> ID $id..."
    $tempPath = Join-Path $env:TEMP $file.name
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($file.file, $tempPath)
    
    try {
        $bmp = [System.Drawing.Image]::FromFile($tempPath)
        
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
        }
        
        $scaledBmp = New-Object System.Drawing.Bitmap([int]$width, [int]$height)
        $g2 = [System.Drawing.Graphics]::FromImage($scaledBmp)
        $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g2.Clear([System.Drawing.Color]::Transparent)
        $g2.DrawImage($bmp, 0, 0, [int]$width, [int]$height)
        $g2.Dispose()
        
        $bmp.Dispose()
        $bmp = $scaledBmp
        
        $bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        
        Remove-Item $tempPath -Force
        
        # Update CSV
        for ($i = 1; $i -lt $csvContent.Count; $i++) {
            if ([string]::IsNullOrWhiteSpace($csvContent[$i])) { continue }
            $cols = $csvContent[$i] -split ","
            if ($cols.Length -gt 0 -and $cols[0] -eq $id) {
                if ($cols.Length -lt ($mediaUrlIdx + 1)) {
                    $diff = ($mediaUrlIdx + 1) - $cols.Length
                    $cols += @("") * $diff
                }
                $cols[$mediaUrlIdx] = "images/catalog/$targetFilename"
                $csvContent[$i] = $cols -join ","
                break
            }
        }
        
        $successCount++
    } catch {
        Write-Output "Error processing $($file.name): $($_.Exception.Message)"
    }
}

$csvContent | Set-Content $csvPath -Encoding UTF8
Write-Output "Successfully matched and downloaded $successCount transparent PNG images!"
