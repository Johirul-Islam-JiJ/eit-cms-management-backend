const path = require('path');
const meetTheTeam = require('@models/MeetTheTeam');

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
    const { name, description, image_url } = req.body;
    if (!name || !description || !image_url) {
      return res.status(400).json({ message: 'Name, description, and image URL are required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'section_0002._id': req.params.id },
      { $push: { 'section_0002.departments': { name, description, image_url } } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0002);
  } catch (error) {
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

    const data = await meetTheTeam.findOneAndUpdate(
      { 'section_0002._id': req.params.id },
      { $pull: { 'section_0002.departments': { _id: departmentId } } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0002);
  } catch (error) {
    res.status(500).json({ message: 'Error removing department', error: error.message });
  }
};

module.exports = {
  getDepartmentSection,
  updateDepartmentTitle,
  addDepartment,
  removeDepartment,
};