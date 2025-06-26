import { db } from './firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';

export async function saveCertificateToFirestore(data) {
  const { certificateId } = data;
  try {
    const certRef = doc(collection(db, "certificates"), certificateId);
    await setDoc(certRef, data);
    console.log("✅ Certificate saved to Firebase");
  } catch (error) {
    console.error("🔥 Error saving to Firestore:", error);
  }
}
