// src/utils/firebaseService.js

import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc  } from 'firebase/firestore';

export async function verifyCertificateById(certificateId) {
  try {
    const certRef = doc(db, 'certificates', certificateId);
    const docSnap = await getDoc(certRef);

    if (!docSnap.exists()) {
      return { valid: false, reason: 'Certificate not found' };
    }

    const certData = docSnap.data();

    if (certData.status === 'Revoked') {
      return { valid: false, reason: 'Certificate has been revoked' };
    }

    return { valid: true, certificate: certData };
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return { valid: false, reason: 'Error verifying certificate' };
  }
}

export async function updateCertificateStatusInFirestore(certificateId, updates) {
  try {
    const certRef = doc(db, 'certificates', certificateId);
    await updateDoc(certRef, updates);
    console.log("🔥 Firestore certificate status updated");
  } catch (error) {
    console.error("❌ Failed to update Firestore status:", error);
  }
}