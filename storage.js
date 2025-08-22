// storage.js - نظام تخزين الملفات والصور
class FileStorage {
    constructor() {
        this.filesKey = 'uploadedFiles';
        this.imagesKey = 'uploadedImages';
    }

    // الحصول على الملفات المخزنة
    getFiles() {
        const files = localStorage.getItem(this.filesKey);
        return files ? JSON.parse(files) : [];
    }

    // الحصول على الصور المخزنة
    getImages() {
        const images = localStorage.getItem(this.imagesKey);
        return images ? JSON.parse(images) : [];
    }

    // حفظ ملف جديد
    saveFile(fileData) {
        const files = this.getFiles();
        files.push(fileData);
        localStorage.setItem(this.filesKey, JSON.stringify(files));
        return files;
    }

    // حفظ صورة جديدة
    saveImage(imageData) {
        const images = this.getImages();
        images.push(imageData);
        localStorage.setItem(this.imagesKey, JSON.stringify(images));
        return images;
    }

    // حذف ملف
    deleteFile(index) {
        const files = this.getFiles();
        files.splice(index, 1);
        localStorage.setItem(this.filesKey, JSON.stringify(files));
        return files;
    }

    // حذف صورة
    deleteImage(index) {
        const images = this.getImages();
        images.splice(index, 1);
        localStorage.setItem(this.imagesKey, JSON.stringify(images));
        return images;
    }

    // تحويل ملف إلى base64
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}

// إنشاء نموذج تخزين عالمي
const fileStorage = new FileStorage();

// دالة إنشاء رابط مشاركة
function generateShareLink(expiryDays, maxUses) {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));
    
    return {
        token: token,
        expiry: expiryDate.getTime(),
        maxUses: parseInt(maxUses),
        usedCount: 0,
        created: new Date().getTime()
    };
}

// دالة حفظ رابط المشاركة
function saveShareLink(shareLink) {
    const links = getShareLinks();
    links.push(shareLink);
    localStorage.setItem('shareLinks', JSON.stringify(links));
    return links;
}

// دالة الحصول على روابط المشاركة
function getShareLinks() {
    const links = localStorage.getItem('shareLinks');
    return links ? JSON.parse(links) : [];
}

// دالة حذف رابط المشاركة
function deleteShareLink(token) {
    let links = getShareLinks();
    links = links.filter(link => link.token !== token);
    localStorage.setItem('shareLinks', JSON.stringify(links));
    return links;
}

// دالة التحقق من صلاحية رابط المشاركة
function isValidShareLink(token) {
    const links = getShareLinks();
    const link = links.find(l => l.token === token);
    
    if (!link) return false;
    
    const now = new Date().getTime();
    if (now > link.expiry) {
        deleteShareLink(token);
        return false;
    }
    
    if (link.maxUses > 0 && link.usedCount >= link.maxUses) {
        deleteShareLink(token);
        return false;
    }
    
    // زيادة عدد مرات الاستخدام
    link.usedCount++;
    const updatedLinks = links.map(l => l.token === token ? link : l);
    localStorage.setItem('shareLinks', JSON.stringify(updatedLinks));
    
    return true;
}