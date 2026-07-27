import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, 'personal_data/projects/items'));
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setProjects(items.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return { projects, loading };
}
