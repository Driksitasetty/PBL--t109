// ============================================================
// Storage Service — Upload Photos to Firebase Storage
// ============================================================
// Used in Module 1 (Lost Person Finder) to upload the missing
// person's photo to Firebase Storage and get a public URL.
// ============================================================

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Upload a photo file to Firebase Storage
// Returns a Promise with { downloadURL, filePath }
// onProgress(percentage) is called during upload
export async function uploadPhoto(file, folder = 'lost_persons', onProgress = null) {
  // Create a unique file path: folder/timestamp_filename
  const timestamp = Date.now();
  const filePath = `${folder}/${timestamp}_${file.name}`;
  const storageRef = ref(storage, filePath);

  return new Promise((resolve, reject) => {
    // Start the upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calculate upload percentage
        const percentage = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(percentage);
      },
      (error) => {
        // Upload failed
        reject(error);
      },
      async () => {
        // Upload complete — get the public download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ downloadURL, filePath });
      }
    );
  });
}

// Delete a photo from Firebase Storage (cleanup)
export async function deletePhoto(filePath) {
  const storageRef = ref(storage, filePath);
  await deleteObject(storageRef);
}
