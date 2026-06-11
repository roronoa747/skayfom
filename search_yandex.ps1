$response = Invoke-WebRequest -Uri 'https://search-maps.yandex.ru/v1/?text=S.Kayfom+Астана&type=biz&lang=ru_RU&results=1&apikey=f3a093a1-44eb-4ea4-89d1-c1e194f1ccbc' -ErrorAction SilentlyContinue
if ($response) {
    Write-Output $response.Content
} else {
    Write-Output "No response"
}
