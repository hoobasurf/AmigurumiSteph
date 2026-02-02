// imgbb-upload.js - Upload vers ImgBB au lieu de Supabase
// GRATUIT et ILLIMITÉ !

const IMGBB_API_KEY = 'VOTRE_CLE_API_ICI'; // Remplacez par votre clé

export async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Image uploadée: ${data.data.url}`);
      return data.data.url; // URL de l'image
    } else {
      throw new Error('Erreur upload ImgBB');
    }
  } catch (error) {
    console.error('❌ Erreur ImgBB:', error);
    throw error;
  }
}

export async function uploadMultipleToImgBB(files, onProgress) {
  const urls = [];
  
  for (let i = 0; i < files.length; i++) {
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
    const url = await uploadToImgBB(files[i]);
    urls.push(url);
  }
  
  return urls;
}
