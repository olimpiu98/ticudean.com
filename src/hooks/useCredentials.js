import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export function useCredentials() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCreds() {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, 'personal_data/certifications/items'));
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setCredentials(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch (error) {
        console.error("Firestore credentials fetch error:", error);
      }
      setLoading(false);
    }
    fetchCreds();
  }, []);

  return { credentials, loading };
}
