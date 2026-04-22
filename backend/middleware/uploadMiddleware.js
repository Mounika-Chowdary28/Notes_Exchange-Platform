const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'notes_exchange',
    resource_type: 'auto',
    // We remove public_id to let Cloudinary handle the naming and extension automatically
    // This ensures the URL generated has a clear .pdf extension
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
