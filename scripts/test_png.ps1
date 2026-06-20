Add-Type -AssemblyName System.Drawing
$wc = New-Object System.Net.WebClient
$wc.DownloadFile("https://downloader.disk.yandex.ru/disk/075eff82d01f72e101e917b4a1ff7c9b5ae66a429431f39a709a601c0f37b216/6a2cb15d/UWJixd5bTXIet5kSdH_k3fK08ld5mjIForm4uWdnDmIIGdAZqeboz6F6I3MW7ce3-rhUnCXfflWIav8LN3HSOg%3D%3D?uid=0&filename=ekzomango.png&disposition=attachment&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&fsize=10539686&hid=be46ca61cfa92b8d0aebcd8dbaecf0f1&media_type=image&tknv=v3&is_direct_zip_experiment=1&etag=0fbfec84c19c5691287c516630b20182", "test_dl.png")
$bmp = [System.Drawing.Image]::FromFile("test_dl.png")
$width = 600
$height = [math]::Round($bmp.Height * 600 / $bmp.Width)
$scaledBmp = New-Object System.Drawing.Bitmap($width, $height)
$g2 = [System.Drawing.Graphics]::FromImage($scaledBmp)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.Clear([System.Drawing.Color]::Transparent)
$g2.DrawImage($bmp, 0, 0, $width, $height)
$g2.Dispose()
$scaledBmp.Save("test_out.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$scaledBmp.Dispose()
Write-Output "Done. Size of test_out.png: $((Get-Item test_out.png).Length)"
