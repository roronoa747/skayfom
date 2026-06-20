const axios = require('axios');

const urls = [
    'https://hookahmarket.ru/search?q=deus+pina',
    'https://kalyan-hut.ru/search/?q=deus+pina',
    'https://allhookah.ru/search/?query=deus+pina',
    'https://shishacity.ru/search/?query=deus+pina',
    'https://justsmoke.ru/search/?q=deus+pina',
    'https://smokylab.ru/search/?q=deus+pina'
];

async function testAll() {
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
testAll();
