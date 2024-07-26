// multerConfig.js
const multer = require('multer');
const path = require('path');

function getRandomNumber(maxLength) {
  const max = Math.pow(10, maxLength) - 1;
  return Math.floor(Math.random() * max);
}

function createMulterConfig(folder) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const randomNum = getRandomNumber(7);
      cb(null, `${file.fieldname}-${randomNum}-${Date.now()}${ext}`);
    }
  });

  return multer({ storage });
}

module.exports = createMulterConfig;
