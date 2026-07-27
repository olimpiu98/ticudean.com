import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { MOCK_PROJECTS, MOCK_CREDENTIALS } from './constants';

export async function syncDemoDataToFirebase() {
  if (!db) {
    alert("Firebase is not initialized. Please check your .env configuration.");
    return;
  }

  try {
    // 1. Sync Projects
    for (let i = 0; i < MOCK_PROJECTS.length; i++) {
      const project = MOCK_PROJECTS[i];
      const projectRef = doc(db, 'personal_data/projects/items', `project_${i}`);
      await setDoc(projectRef, { ...project, order: i }, { merge: true });
    }

    // 2. Sync Credentials
    for (let i = 0; i < MOCK_CREDENTIALS.length; i++) {
      const cred = MOCK_CREDENTIALS[i];
      const credRef = doc(db, 'personal_data/certifications/items', `cred_${i}`);
      await setDoc(credRef, { ...cred, order: i }, { merge: true });
    }

    // 3. Sync Tech Stack (optional, if you store it in DB later)
    // const techRef = doc(db, 'perosnal_data', 'techStack');
    // await setDoc(techRef, MOCK_TECH_STACK, { merge: true });

    alert("✅ Data successfully synced to Firebase! Reload the page to see data fetched from the database.");
  } catch (error) {
    console.error("Error syncing data:", error);
    alert("❌ Error syncing data to Firebase. Make sure your Firestore rules allow writes for the admin user.");
  }
}
