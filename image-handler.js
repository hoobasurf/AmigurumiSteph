// image-handler.js
const IMGBB_API_KEY = ‘1612fdd94e39f24c3d14f1864f41d591’;

async function compressImage(file, maxSize = 1200, quality = 0.7) {
if (!file.type.startsWith(‘image/’)) return file;
return new Promise((resolve) => {
const reader = new FileReader();
reader.onload = (e) => {
const img = new Image();
img.onload = () => {
const canvas = document.createElement(‘canvas’);
let width = img.width, height = img.height;
if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
canvas.width = width; canvas.height = height;
canvas.getContext(‘2d’).drawImage(img, 0, 0, width, height);
canvas.toBlob((blob) => {
resolve(new File([blob], file.name.replace(/.\w+$/, ‘.jpg’), { type: ‘image/jpeg’ }));
}, ‘image/jpeg’, quality);
};
img.src = e.target.result;
};
reader.readAsDataURL(file);
});
}

async function uploadToImgBB(file) {
const formData = new FormData();
formData.append(‘image’, file);
let lastError;
for (let i = 0; i < 3; i++) {
try {
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);
const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
method: ‘POST’,
body: formData,
signal: controller.signal
});
clearTimeout(timeout);
const data = await response.json();
if (data.success) return data.data.url;
throw new Error(‘Erreur ImgBB’);
} catch (err) {
lastError = err;
console.log(`⚠️ Tentative ${i+1} échouée, retry...`);
await new Promise(r => setTimeout(r, 1500));
}
}
throw lastError;
}

window.uploadImage = async function(file) {
const compressed = await compressImage(file);
return await uploadToImgBB(compressed);
};

window.uploadMultipleImages = async function(files, onProgress) {
const urls = [];
for (let i = 0; i < files.length; i++) {
if (onProgress) onProgress(i + 1, files.length);
urls.push(await window.uploadImage(files[i]));
}
return urls;
};

console.log(‘✅ Image Handler chargé’);
