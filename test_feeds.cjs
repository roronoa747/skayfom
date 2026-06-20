const axios = require('axios');

async function checkFeeds() {
    const urls = [
        'https://hookah-time.shop/bitrix/catalog_export/yandex.php',
        'https://hookah-time.shop/bitrix/catalog_export/export.xml',
        'https://s2b.ru/bitrix/catalog_export/yandex.php',
        'https://oshisha.net/bitrix/catalog_export/yandex.php',
        'https://pitersmoke.ru/bitrix/catalog_export/yandex.php'
    ];
    for (const url of urls) {
        try {
            console.log('Testing', url);
            const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
            console.log('Success:', url, 'Length:', res.data.length);
        } catch(e) {
            console.log('Failed:', url, e.response ? e.response.status : e.message);
        }
    }
}
checkFeeds();
