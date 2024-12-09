const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const filePath = path.join(__dirname, '..', 'public','uploads', 'textfile.txt');
// const imageDir = path.join(__dirname, '..', 'public', 'images');
const uploadFile = multer({ dest: path.join(__dirname,'..','public', 'uploads') });


const textfile = path.dirname(filePath);

if (!fs.existsSync(textfile)) {
  fs.mkdirSync(textfile);
} 
// const upload = multer({ dest: imageDir });
     
router.post('/upload', (req, res) => {
  const text = req.body.text;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  fs.writeFile(filePath, text, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).json({ error: 'Failed to save text file' });
    }
    res.status(200).json({ message: 'Text file created successfully' });
  });
});

router.get('/view', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Failed to read text file' });
    }
    res.status(200).json({ content: data });
  });
});

// router.post('/uploadImage', upload.single('imageFile'), (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }
//     res.status(200).json({ message: 'Image uploaded successfully', fileName: req.file.filename });
//   });

// router.get('/viewImage/:fileName', (req, res) => {
//     const file = path.join(imageDir, req.params.fileName);
  
//     if (!fs.existsSync(file)) {
//       return res.status(404).json({ error: 'Image file not found' });
//     }
  
//     res.sendFile(file);
//   });

router.post('/uploadFile', uploadFile.single('textFile'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    const filePath = path.join(req.file.destination, req.file.originalname);
    fs.rename(req.file.path, filePath, (err) => {
      if (err) {
        console.error('Error saving file:', err);
        return res.status(500).json({ error: 'Failed to save file' });
      }
      res.json({ message: 'File uploaded successfully', fileName: req.file.originalname });
    });
  });
router.get('/viewText/:fileName', (req, res) => {
    const filePath = path.join(__dirname, '..','public', 'uploads', req.params.fileName);
    res.sendFile(filePath);
  });    
module.exports = router;
