const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/prescriptions');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.'));
    }
  }
});

// Upload prescription
router.post('/upload', auth, upload.single('prescription'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const prescription = {
      name: req.file.originalname,
      url: `/uploads/prescriptions/${req.file.filename}`,
      uploadDate: new Date()
    };

    req.user.prescriptions.push(prescription);
    await req.user.save();

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading prescription' });
  }
});

// Get user's prescriptions
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('prescriptions');
    res.json(user.prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
});

// Delete prescription
router.delete('/:id', auth, async (req, res) => {
  try {
    const prescription = req.user.prescriptions.id(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    prescription.remove();
    await req.user.save();

    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting prescription' });
  }
});

module.exports = router; 