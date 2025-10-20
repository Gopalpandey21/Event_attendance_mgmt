const multer = require('multer');
const path = require('path');

// Configure storage options for multer
const storage = multer.diskStorage({
  destination: './uploads/', // Folder to save the files in
  filename: function(req, file, cb) {
    // Create a unique filename to prevent conflicts
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize the upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 1MB
  fileFilter: function(req, file, cb) {
    // Allow only images
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only images are allowed!');
    }
  }
});

module.exports = upload;