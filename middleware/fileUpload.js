////file upload and all

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload folder location
const uploadPath = path.join(__dirname, "../uploads");

// Create uploads folder automatically
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName + extension);
  },
});

// Allowed MIME types
const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

// Allowed file extensions
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

// File filter
const fileFilter = (req, file, cb) => {

  const extension = path
    .extname(file.originalname)
    .toLowerCase();


  // PHOTO
  if (file.fieldname === "photo") {

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp"
    ];

    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp"
    ];

    const isMimeTypeAllowed =
      allowedMimeTypes.includes(file.mimetype);

    const isExtensionAllowed =
      allowedExtensions.includes(extension);

    if (isMimeTypeAllowed && isExtensionAllowed) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Invalid photo type. Only JPG, JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }


  // HOUSE RULES
  if (file.fieldname === "houseRules") {

    const isMimeTypeAllowed =
      file.mimetype === "application/pdf";

    const isExtensionAllowed =
      extension === ".pdf";

    if (isMimeTypeAllowed && isExtensionAllowed) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Invalid house rules file. Only PDF files are allowed."
      ),
      false
    );
  }


  // Unknown file field
  return cb(
    new Error("Unexpected file field."),
    false
  );
};

// Multer configuration
const upload = multer({
  storage: storage,

  fileFilter: fileFilter,

  limits: {
    files: 2, 
  },
});

module.exports = upload;

// what is used is: from chatgpt for this--  https://chatgpt.com/s/t_6aa8218731f081918fdec80d71526015    https://chatgpt.com/s/t_6aa831b770608191b4859df69d864283   https://chatgpt.com/s/t_6aa9476b53b481918f48a940e83fc4ee https://chatgpt.com/s/t_6ac23d03ae448191b084276c3a5582e2

