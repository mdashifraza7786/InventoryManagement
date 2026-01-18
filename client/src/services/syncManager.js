import offlineStorage from './offlineStorage';
import { saleAPI } from './api';
import toast from 'react-hot-toast';

class SyncManager {
    constructor() {
        this.isSyncing = false;
        this.listeners = new Set();
        this.setupOnlineListener();
    }

    setupOnlineListener() {
        window.addEventListener('online', () => {
            console.log('Back online, attempting to sync pending sales...');
            this.syncPendingSales();
        });
    }

    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notifyListeners(event, data) {
        this.listeners.forEach(callback => callback(event, data));
    }

    async syncPendingSales() {
        if (this.isSyncing || !navigator.onLine) {
            return { synced: 0, failed: 0 };
        }

        this.isSyncing = true;
        this.notifyListeners('sync-start');

        try {
            const pendingSales = await offlineStorage.getPendingSales();

            if (pendingSales.length === 0) {
                this.isSyncing = false;
                return { synced: 0, failed: 0 };
            }

            console.log(`Syncing ${pendingSales.length} pending sales...`);
            toast.loading(`Syncing ${pendingSales.length} offline sales...`, { id: 'sync-toast' });

            let synced = 0;
            let failed = 0;
            const results = [];

            for (const pendingSale of pendingSales) {
                try {
                    const response = await saleAPI.create({
                        items: pendingSale.items,
                        paymentMethod: pendingSale.paymentMethod
                    });

                    await offlineStorage.markSaleAsSynced(pendingSale.id);
                    synced++;
                    results.push({
                        success: true,
                        pendingSale,
                        serverResponse: response.data
                    });

                    if (response.data.lowStockAlerts?.length > 0) {
                        response.data.lowStockAlerts.forEach(alert => {
                            toast.error(`⚠️ Low Stock: ${alert.productName} (${alert.currentStock} left)`, {
                                duration: 6000
                            });
                        });
                    }
                } catch (error) {
                    console.error(`Failed to sync sale ${pendingSale.id}:`, error);
                    failed++;
                    results.push({
                        success: false,
                        pendingSale,
                        error: error.message
                    });
                }
            }

            await offlineStorage.clearSyncedSales();

            if (synced > 0) {
                toast.success(`✅ Synced ${synced} offline sale${synced > 1 ? 's' : ''}!`, { id: 'sync-toast' });
            }

            if (failed > 0) {
                toast.error(`❌ Failed to sync ${failed} sale${failed > 1 ? 's' : ''}. Will retry later.`, { duration: 5000 });
            }

            this.notifyListeners('sync-complete', { synced, failed, results });
            return { synced, failed, results };
        } catch (error) {
            console.error('Sync error:', error);
            toast.error('Sync failed. Will retry when possible.', { id: 'sync-toast' });
            this.notifyListeners('sync-error', error);
            return { synced: 0, failed: 0, error };
        } finally {
            this.isSyncing = false;
        }
    }

    async createOfflineSale(saleData) {
        try {
            const pendingSale = await offlineStorage.addPendingSale(saleData);
            this.notifyListeners('sale-queued', pendingSale);
            return pendingSale;
        } catch (error) {
            console.error('Error queuing offline sale:', error);
            throw error;
        }
    }

    async getPendingCount() {
        return offlineStorage.getPendingSalesCount();
    }

    async getPendingSales() {
        return offlineStorage.getPendingSales();
    }
}

const syncManager = new SyncManager();

export default syncManager;
