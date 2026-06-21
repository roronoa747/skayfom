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
                
                let data = results.data;
                
                // Workaround for Google Sheets Smart Tables adding "Столбец X" or "Column X"
                if (data && data.length > 0 && results.meta && results.meta.fields) {
                    const firstField = String(results.meta.fields[0] || '').toLowerCase();
                    if (firstField.includes('столбец') || firstField.includes('column') || firstField === '') {
                        const firstItemValues = Object.values(data[0]).map(v => String(v).trim().toLowerCase());
                        if (firstItemValues.includes('id') && firstItemValues.includes('flavor')) {
                            const newFields = Object.values(data[0]).map(v => String(v).trim());
                            const newData = [];
                            for (let i = 1; i < data.length; i++) {
                                const oldItem = data[i];
                                const newItem = {};
                                const oldKeys = Object.keys(oldItem);
                                for (let j = 0; j < oldKeys.length; j++) {
                                    if (newFields[j]) {
                                        newItem[newFields[j]] = oldItem[oldKeys[j]];
                                    }
                                }
                                newData.push(newItem);
                            }
                            data = newData;
                        }
                    }
                }

                if (data && data.length > 0) {
                    resolve(data);
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

export async function loadCitiesData(url) {
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
                    console.warn("CSV parsing warning for cities:", results.errors);
                }
                if (results.data && results.data.length > 0) {
                    resolve(results.data);
                } else {
                    reject(new Error("Cities data is empty"));
                }
            },
            error: function(err) {
                console.error("Network error fetching cities CSV:", err);
                reject(err);
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
