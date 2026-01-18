import React from 'react';
import { FiWifiOff } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

function OfflineBanner() {
    const { isOnline } = useApp();

    if (isOnline) {
        return null;
    }

    return (
        <div className="offline-banner">
            <FiWifiOff size={20} />
            <span>Running Offline - Some features may be limited</span>
        </div>
    );
}

export default OfflineBanner;
