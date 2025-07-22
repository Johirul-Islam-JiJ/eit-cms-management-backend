const fs = require('fs');
const path = require('path');

// Allowed image extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

// Upload Image
const uploadImage = (file, filename, folderPath) => {
  if (!file) throw new Error('No file provided');

  // Get extension
  const ext = path.extname(file.name).toLowerCase();

  // Validate extension
  if (!allowedExtensions.includes(ext)) {
    throw new Error('Invalid file type. Only image files are allowed');
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Ensure directory exists
  fs.mkdirSync(folderPath, { recursive: true });

  // Append extension to filename
  const finalFileName = `${filename}${ext}`;
  const fullPath = path.join(folderPath, finalFileName);

  // Move file
  file.mv(fullPath, (err) => {
    if (err) throw err;
  });

  return fullPath;
};

// Delete Image
const deleteImage = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  } else {
    throw new Error('File does not exist');
  }
};

module.exports = { uploadImage, deleteImage };
