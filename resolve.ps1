$req = [System.Net.WebRequest]::Create('https://go.2gis.com/M2Y29')
$req.AllowAutoRedirect = $false
try {
    $res = $req.GetResponse()
    Write-Output $res.Headers['Location']
} catch {
    Write-Output $_.Exception.Response.Headers['Location']
}
