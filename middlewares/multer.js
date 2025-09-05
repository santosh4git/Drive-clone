const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary.config');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder
   // allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'] 
  },
});

const upload = multer({ storage });

module.exports = upload;
