$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$csvPath = "catalog_template.csv"
$csv = Import-Csv $csvPath -Encoding UTF8
$overdoseFilesPath = "overdose_files.json"

if (-not (Test-Path $overdoseFilesPath)) {
    Write-Host "overdose_files.json not found."
    exit
}

$filesData = Get-Content $overdoseFilesPath -Raw | ConvertFrom-Json

$mapping = @{
    "401" = "Jelly Grape.jpg"
    "402" = "Apple Juicy.jpg"
    "404" = "Blueberry.jpg"
    "405" = "post_Kiwi.jpg"
    "406" = "Pink Grapefruit.jpg"
    "407" = "Wintergeen 1080х1080.jpg"
    "409" = "Strawberry квадрат.jpg"
    "411" = "Gin Aperol sqd.jpg"
    "412" = "Watermelon.jpg"
    "413" = "Fruittella.jpg"
    "415" = "Dear Pear.jpg"
    "416" = "Lime-Lemon.jpg"
    "417" = "Jelly Grape.jpg"
    "418" = "Lotus Berry.jpg"
    "419" = "Manila malina.jpg"
    "420" = "Orange soda.jpg"
    "421" = "Peach лента.jpg"
    "422" = "Pineapple chunks.jpg"
    "423" = "Samarkand Melon 1080х1080.jpg"
    "424" = "Strawberry kiwi.jpg"
    "425" = "Waffles лента.jpg"
    "426" = "Wild Strawberry.jpg"
    "427" = "Peach Ice .jpg"
    "428" = "Kashmir Citrus.jpg"
}

$updatedCount = 0

foreach ($row in $csv) {
    if ($row.brand -eq 'Overdose') {
        $id = $row.id
        
        if ($mapping.ContainsKey($id)) {
            $filename = $mapping[$id]
            
            # Find the file url in $filesData
            $fileObj = $filesData | Where-Object { $_.name -eq $filename }
            if ($fileObj) {
                $downloadUrl = $fileObj.file
                $destPath = "public/images/catalog/$id.png"
                
                Write-Host "Downloading $filename -> ID $id..."
                
                try {
                    $response = Invoke-WebRequest -Uri $downloadUrl -UseBasicParsing
                    $ms = New-Object System.IO.MemoryStream(,$response.Content)
                    $img = [System.Drawing.Image]::FromStream($ms)
                    
                    # Resize
                    $maxSize = 600
                    $width = $img.Width
                    $height = $img.Height
                    
                    if ($width -gt $maxSize -or $height -gt $maxSize) {
                        if ($width -gt $height) {
                            $newWidth = $maxSize
                            $newHeight = [int]($height * $maxSize / $width)
                        } else {
                            $newHeight = $maxSize
                            $newWidth = [int]($width * $maxSize / $height)
                        }
                    } else {
                        $newWidth = $width
                        $newHeight = $height
                    }
                    
                    $bitmap = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
                    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
                    
                    # Draw resized image
                    $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)
                    
                    # Make white background transparent
                    $bitmap.MakeTransparent([System.Drawing.Color]::White)
                    
                    # Also try making black transparent? The user said "фото белые а сайт черный"
                    # so the background of the image was white. 
                    
                    $bitmap.Save("c:\Users\ilyas\Documents\skayfom\$destPath", [System.Drawing.Imaging.ImageFormat]::Png)
                    
                    $graphics.Dispose()
                    $bitmap.Dispose()
                    $img.Dispose()
                    $ms.Dispose()
                    
                    $row.media_url = "images/catalog/$id.png"
                    $updatedCount++
                } catch {
                    Write-Host "Failed to process ID $id : $($_.Exception.Message)"
                }
            } else {
                Write-Host "File '$filename' not found in Yandex Disk response!"
            }
        }
    }
}

$csv | Export-Csv "catalog_template.csv" -NoTypeInformation -Encoding UTF8
Write-Host "Successfully processed $updatedCount Overdose images!"

