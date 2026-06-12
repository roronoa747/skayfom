$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Сервер запущен на http://localhost:$port"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $response = $context.Response
        $request = $context.Request
        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        $localFilePath = Join-Path $PWD $path.TrimStart("/")

        if (Test-Path $localFilePath -PathType Leaf) {
            try {
                $content = [System.IO.File]::ReadAllBytes($localFilePath)
                $response.ContentLength64 = $content.Length
                
                # Set basic MIME types
                switch -Regex ($localFilePath) {
                    "\.html$" { $response.ContentType = "text/html" }
                    "\.css$" { $response.ContentType = "text/css" }
                    "\.js$" { $response.ContentType = "application/javascript" }
                    "\.csv$" { $response.ContentType = "text/csv" }
                    "\.svg$" { $response.ContentType = "image/svg+xml" }
                    "\.png$" { $response.ContentType = "image/png" }
                    "\.jpg$" { $response.ContentType = "image/jpeg" }
                    default { $response.ContentType = "application/octet-stream" }
                }
                
                $response.OutputStream.Write($content, 0, $content.Length)
            } catch {
                $response.StatusCode = 500
            }
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
