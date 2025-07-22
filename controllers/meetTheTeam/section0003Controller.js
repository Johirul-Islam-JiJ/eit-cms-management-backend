const path = require('path');
const meetTheTeam = require('@models/MeetTheTeam');
const { uploadImage, deleteImage } = require('@imageHandler');

const imagePath = './storage/image/meetTheTeam/section0003';

// Get section data
const getSection = async (req, res) => {
  try {
    const data = await meetTheTeam.findOne({ 'section_0003._id': req.params.id });
    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(data.section_0003);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching section', error: error.message });
  }
};

// Update section title
const updateSectionTitle = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'section_0003._id': req.params.id },
      { $set: { 'section_0003.title': title } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0003);
  } catch (error) {
    res.status(500).json({ message: 'Error updating title', error: error.message });
  }
};

// Add image
const addImage = async (req, res) => {
  try {
    const { description } = req.body;
    const image = req.files?.image;

    if (!description || !image) {
      return res.status(400).json({ message: 'Description and image are required' });
    }

    // Check if section exists
    const sectionData = await meetTheTeam.findOne({ 'section_0003._id': req.params.id });
    if (!sectionData) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Upload image
    const timestamp = Date.now();
    const fileName = `${req.params.id}_${timestamp}`;
    const savedPath = uploadImage(image, fileName, imagePath);
    const image_url = savedPath;

    // Create new image object
    const newImage = { image_url, description };

    // Push image to the correct section
    const updatedData = await meetTheTeam.findOneAndUpdate(
      { 'section_0003._id': req.params.id },
      { $push: { 'section_0003.images': newImage } },
      { new: true }
    );

    res.json(updatedData.section_0003);

  } catch (error) {
    console.error('Add Image Error:', error);
    res.status(500).json({ message: 'Error adding image', error: error.message });
  }
};

// Remove image
const removeImage = async (req, res) => {
  try {
    const { imageId } = req.body;
    if (!imageId) {
      return res.status(400).json({ message: 'Image ID is required' });
    }

    // Find the document and locate the image
    const doc = await meetTheTeam.findOne({ 'section_0003._id': req.params.id });
    if (!doc) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const image = doc.section_0003.images.find(img => String(img._id) === imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Try to delete the image file
    if (image.image_url) {
      try {
        const normalizedPath = path.resolve(image.image_url);
        deleteImage(normalizedPath);
      } catch (err) {
        console.warn('Image deletion failed:', err.message);
        // Continue even if image deletion fails
      }
    }

    // Remove the image from the array
    const updatedDoc = await meetTheTeam.findOneAndUpdate(
      { 'section_0003._id': req.params.id },
      { $pull: { 'section_0003.images': { _id: imageId } } },
      { new: true }
    );

    res.json(updatedDoc.section_0003);

  } catch (error) {
    console.error('Error removing image:', error);
    res.status(500).json({ message: 'Error removing image', error: error.message });
  }
};

module.exports = {
  getSection,
  updateSectionTitle,
  addImage,
  removeImage,
};