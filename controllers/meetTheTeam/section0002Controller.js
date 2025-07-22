const path = require('path');
const meetTheTeam = require('@models/MeetTheTeam');

const { uploadImage, deleteImage } = require('@imageHandler');

const imagePath = './storage/image/meetTheTeam/section0002';

// Get section data
const getDepartmentSection = async (req, res) => {
  try {
    const data = await meetTheTeam.findOne({ 'section_0002._id': req.params.id });
    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(data.section_0002);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching section', error: error.message });
  }
};

// Update section title
const updateDepartmentTitle = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'section_0002._id': req.params.id },
      { $set: { 'section_0002.title': title } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0002);
  } catch (error) {
    res.status(500).json({ message: 'Error updating title', error: error.message });
  }
};

// Add department
const addDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.files?.image;

    if (!name || !description || !image) {
      return res.status(400).json({ message: 'Name, description, and image are required' });
    }

    // Check if section exists
    const sectionData = await meetTheTeam.findOne({ 'section_0002._id': req.params.id });
    if (!sectionData) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Upload image
    const fileName = String(req.params.id);
    const savedPath = uploadImage(image, fileName, imagePath);
    const image_url = savedPath;

    // Create full department object
    const newDepartment = { name, description, image_url };

    // Push department to the correct section
    const updatedData = await meetTheTeam.findOneAndUpdate(
      { 'section_0002._id': req.params.id },
      { $push: { 'section_0002.departments': newDepartment } },
      { new: true }
    );

    res.json(updatedData.section_0002);

  } catch (error) {
    console.error('Add Department Error:', error);
    res.status(500).json({ message: 'Error adding department', error: error.message });
  }
};


// Remove department
const removeDepartment = async (req, res) => {
  try {
    const { departmentId } = req.body;

    if (!departmentId) {
      return res.status(400).json({ message: 'Department ID is required' });
    }

    // Step 1: Find the document and locate the department
    const doc = await meetTheTeam.findOne({ 'section_0002._id': req.params.id });
    if (!doc) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const department = doc.section_0002.departments.find(dep => String(dep._id) === departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Step 2: Try to delete the image file
    if (department.image_url) {
      try {
        const normalizedPath = path.resolve(department.image_url);
        deleteImage(normalizedPath);
      } catch (err) {
        console.warn('Image deletion failed:', err.message);
        // Don't stop the process if image deletion fails
      }
    }

    // Step 3: Remove the department from the array
    const updatedDoc = await meetTheTeam.findOneAndUpdate(
      { 'section_0002._id': req.params.id },
      { $pull: { 'section_0002.departments': { _id: departmentId } } },
      { new: true }
    );

    res.json(updatedDoc.section_0002);

  } catch (error) {
    console.error('Error removing department:', error);
    res.status(500).json({ message: 'Error removing department', error: error.message });
  }
};

module.exports = {
  getDepartmentSection,
  updateDepartmentTitle,
  addDepartment,
  removeDepartment,
};