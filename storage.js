// نظام التخزين للملفات والصور
const fileStorage = {
    // الحصول على المفاتيح
    getFilesKey: () => 'uploadedFiles',
    getImagesKey: () => 'uploadedImages',
    
    // حفظ ملف
    saveFile: (fileData) => {
        const files = fileStorage.getFiles();
        files.push(fileData);
        localStorage.setItem(fileStorage.getFilesKey(), JSON.stringify(files));
    },
    
    // الحصول على الملفات
    getFiles: () => {
        const files = localStorage.getItem(fileStorage.getFilesKey());
        return files ? JSON.parse(files) : [];
    },
    
    // حذف ملف
    deleteFile: (index) => {
        const files = fileStorage.getFiles();
        files.splice(index, 1);
        localStorage.setItem(fileStorage.getFilesKey(), JSON.stringify(files));
    },
    
    // حفظ صورة
    saveImage: (imageData) => {
        const images = fileStorage.getImages();
        images.push(imageData);
        localStorage.setItem(fileStorage.getImagesKey(), JSON.stringify(images));
    },
    
    // الحصول على الصور
    getImages: () => {
        const images = localStorage.getItem(fileStorage.getImagesKey());
        return images ? JSON.parse(images) : [];
    },
    
    // حذف صورة
    deleteImage: (index) => {
        const images = fileStorage.getImages();
        images.splice(index, 1);
        localStorage.setItem(fileStorage.getImagesKey(), JSON.stringify(images));
    },
    
    // تحويل الملف إلى base64
    fileToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
};