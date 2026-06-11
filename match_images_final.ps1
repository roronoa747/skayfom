$csvPath = "c:\Users\ilyas\Documents\skayfom\catalog_template.csv"
$downloads = "C:\Users\ilyas\Downloads"
$chabaccoDir = $null
$dirs = Get-ChildItem -Path $downloads -Directory
foreach ($dir in $dirs) {
    $target = Get-ChildItem -Path $dir.FullName -Directory -Filter "01_Chabacco" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($target -ne $null) {
        $chabaccoDir = $target
        break
    }
}

if ($null -eq $chabaccoDir) {
    Write-Output "Could not find 01_Chabacco folder"
    exit
}
$sourceDir = $chabaccoDir.FullName

$targetDir = "c:\Users\ilyas\Documents\skayfom\public\images\chabacco"
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

$images = Get-ChildItem -Path $sourceDir -Recurse -Include *.jpg,*.png

$imageMap = @{}
foreach ($img in $images) {
    $baseName = $img.BaseName.ToLower()
    $baseName = $baseName -replace "chabacco", ""
    $baseName = $baseName -replace "[^\p{L}\p{N}]", ""
    if ($baseName.Length -gt 0) {
        $imageMap[$baseName] = $img.FullName
    }
}

$csvContent = Get-Content $csvPath -Encoding UTF8
$header = $csvContent[0] -split ","

$idIdx = 0
$brandIdx = [array]::IndexOf($header, "brand")
$flavorIdx = [array]::IndexOf($header, "flavor")
$mediaUrlIdx = [array]::IndexOf($header, "media_url")

$matchCount = 0

for ($i = 1; $i -lt $csvContent.Length; $i++) {
    $line = $csvContent[$i].Trim()
    if ($line.Length -eq 0) { continue }
    
    $cols = $line -split ","
    
    if ($cols[$brandIdx].Trim() -ieq "chabacco") {
        $flavor = $cols[$flavorIdx].Trim()
        $normFlavor = $flavor.ToLower() -replace "[^\p{L}\p{N}]", ""
        
        $matchedImg = $null
        
        if ($imageMap.ContainsKey($normFlavor)) {
            $matchedImg = $imageMap[$normFlavor]
        } else {
            foreach ($key in $imageMap.Keys) {
                if ($key.Length -ge 3 -and $normFlavor.Length -ge 3) {
                    if ($key.Contains($normFlavor) -or $normFlavor.Contains($key)) {
                        $matchedImg = $imageMap[$key]
                        break
                    }
                }
            }
        }
        
        if ($matchedImg -ne $null) {
            $ext = [System.IO.Path]::GetExtension($matchedImg)
            $id = $cols[$idIdx].Trim()
            $targetFilename = "$id$ext"
            $targetPath = Join-Path $targetDir $targetFilename
            
            Copy-Item -Path $matchedImg -Destination $targetPath -Force
            $cols[$mediaUrlIdx] = "images/chabacco/$targetFilename"
            $matchCount++
        }
    }
    
    $csvContent[$i] = $cols -join ","
}

$csvContent | Set-Content $csvPath -Encoding UTF8
Write-Output "Matched and copied $matchCount images for Chabacco using IDs for filenames."
