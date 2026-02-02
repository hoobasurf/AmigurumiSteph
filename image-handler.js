// image-handler.js
// Fichier unique pour gérer TOUTES les images de TOUTES les pages

const IMGBB_API_KEY = '1612fdd94e39f24c3d14f1864f41d591';

// ========== COMPRESSION AUTOMATIQUE ==========
async function compressImage(file, maxSize = 1200, quality = 0.7) {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { 
            type: 'image/jpeg' 
          });
          console.log(`📸 ${file.name}: ${(file.size/1024).toFixed(0)}KB → ${(compressedFile.size/1024).toFixed(0)}KB`);
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ========== UPLOAD VERS IMGBB ==========
async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log(`✅ Uploadé: ${data.data.url}`);
    return data.data.url;
  } else {
    throw new Error('Erreur upload ImgBB');
  }
}

// ========== FONCTIONS GLOBALES ==========
window.uploadImage = async function(file) {
  const compressed = await compressImage(file);
  const url = await uploadToImgBB(compressed);
  return url;
};

window.uploadMultipleImages = async function(files, onProgress) {
  const urls = [];
  
  for (let i = 0; i < files.length; i++) {
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
    
    const url = await uploadImage(files[i]);
    urls.push(url);
  }
  
  return urls;
};

console.log('✅ Image Handler chargé - Compression + ImgBB actifs');
