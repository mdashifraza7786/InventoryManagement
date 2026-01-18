const DB_NAME = 'InventoryBillingDB';
const DB_VERSION = 1;
const PENDING_SALES_STORE = 'pendingSales';

class OfflineStorage {
    constructor() {
        this.db = null;
        this.initPromise = this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains(PENDING_SALES_STORE)) {
                    const store = db.createObjectStore(PENDING_SALES_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                    store.createIndex('synced', 'synced', { unique: false });
                }
            };
        });
    }

    async ensureDB() {
        if (!this.db) {
            await this.initPromise;
        }
        return this.db;
    }

    async addPendingSale(saleData) {
        const db = await this.ensureDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([PENDING_SALES_STORE], 'readwrite');
            const store = transaction.objectStore(PENDING_SALES_STORE);

            const pendingSale = {
                ...saleData,
                createdAt: new Date().toISOString(),
                synced: 0,
                tempId: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };

            const request = store.add(pendingSale);

            request.onsuccess = () => {
                resolve({ ...pendingSale, id: request.result });
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getPendingSales() {
        const db = await this.ensureDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([PENDING_SALES_STORE], 'readonly');
            const store = transaction.objectStore(PENDING_SALES_STORE);
            const request = store.getAll();

            request.onsuccess = () => {
                const allSales = request.result || [];
                const pendingSales = allSales.filter(sale => sale.synced === 0);
                resolve(pendingSales);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async markSaleAsSynced(id) {
        const db = await this.ensureDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([PENDING_SALES_STORE], 'readwrite');
            const store = transaction.objectStore(PENDING_SALES_STORE);
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const sale = getRequest.result;
                if (sale) {
                    sale.synced = 1;
                    sale.syncedAt = new Date().toISOString();
                    const updateRequest = store.put(sale);
                    updateRequest.onsuccess = () => resolve(sale);
                    updateRequest.onerror = () => reject(updateRequest.error);
                } else {
                    resolve(null);
                }
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }

    async deletePendingSale(id) {
        const db = await this.ensureDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([PENDING_SALES_STORE], 'readwrite');
            const store = transaction.objectStore(PENDING_SALES_STORE);
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async clearSyncedSales() {
        const db = await this.ensureDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([PENDING_SALES_STORE], 'readwrite');
            const store = transaction.objectStore(PENDING_SALES_STORE);
            const request = store.getAll();

            request.onsuccess = () => {
                const allSales = request.result || [];
                const syncedSales = allSales.filter(sale => sale.synced === 1);

                syncedSales.forEach(sale => {
                    store.delete(sale.id);
                });

                resolve(true);
            };

            request.onerror = () => reject(request.error);
        });
    }

    async getPendingSalesCount() {
        try {
            const sales = await this.getPendingSales();
            return sales.length;
        } catch (error) {
            console.error('Error getting pending count:', error);
            return 0;
        }
    }
}

const offlineStorage = new OfflineStorage();

export default offlineStorage;
