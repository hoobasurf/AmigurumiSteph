// compress.js - Compression universelle pour toutes les pages
// À importer dans accueil.html, owner.html, messagerie.html, actualite.html, video.html

export async function compressImage(file, maxSize = 1200, quality = 0.7) {
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
        
        // Réduire à maxSize
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
          const originalSize = (file.size / 1024).toFixed(0);
          const compressedSize = (compressedFile.size / 1024).toFixed(0);
          const reduction = ((1 - compressedFile.size / file.size) * 100).toFixed(0);
          console.log(`📸 ${file.name}: ${originalSize}KB → ${compressedSize}KB (-${reduction}%)`);
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export async function compressMultipleImages(files, maxSize = 1200, quality = 0.7) {
  const compressed = [];
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      compressed.push(await compressImage(file, maxSize, quality));
    } else {
      compressed.push(file);
    }
  }
  return compressed;
}
