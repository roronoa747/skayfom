export async function loadCatalogData(url, fallbackUrl) {
    return new Promise((resolve, reject) => {
        if (typeof Papa === 'undefined') {
            return reject(new Error("PapaParse is not loaded"));
        }
        
        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results.errors && results.errors.length > 0) {
                    console.warn("CSV parsing warning:", results.errors);
                }
                if (results.data && results.data.length > 0) {
                    resolve(results.data);
                } else {
                    loadFallback(fallbackUrl).then(resolve).catch(reject);
                }
            },
            error: function(err) {
                console.error("Network error fetching CSV:", err);
                loadFallback(fallbackUrl).then(resolve).catch(reject);
            }
        });
    });
}

function loadFallback(fallbackUrl) {
    return new Promise((resolve, reject) => {
        Papa.parse(fallbackUrl, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results.data) {
                    resolve(results.data);
                } else {
                    reject(new Error("Fallback data is empty"));
                }
            },
            error: function(err) {
                console.error("Failed to load fallback CSV:", err);
                reject(err);
            }
        });
    });
}
