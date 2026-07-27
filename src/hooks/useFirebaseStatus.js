import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export function useFirebaseStatus() {
  const [status, setStatus] = useState('checking'); // 'online' | 'restricted' | 'offline' | 'checking'
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    async function checkFirebaseHealth() {
      if (!db) {
        setStatus('offline');
        return;
      }

      try {
        // Probe read access against Firestore collection
        const probeQuery = query(collection(db, 'personal_data/projects/items'), limit(1));
        await getDocs(probeQuery);
        setStatus('online');
      } catch (err) {
        console.warn("Firestore read status check:", err.code || err.message);
        if (err.code === 'permission-denied' || err.message?.includes('permission')) {
          setStatus('restricted');
          setErrorDetails('Read access blocked by Security Rules');
        } else {
          setStatus('restricted');
          setErrorDetails(err.message || 'Connection restricted');
        }
      }
    }

    checkFirebaseHealth();
  }, []);

  return {
    status,
    isOnline: status === 'online',
    isRestricted: status === 'restricted',
    isOffline: status === 'offline',
    errorDetails
  };
}
