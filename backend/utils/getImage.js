const path = require('path');

const getImg = (req, res, directory) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../', directory, filename); // Construct the file path

  res.sendFile(filePath, err => {
    if (err) {
      res.status(404).json({ message: 'Image not found' });
    }
  });
};

module.exports = getImg;
