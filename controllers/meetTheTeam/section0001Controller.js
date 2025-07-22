const path = require('path');
const meetTheTeam = require('@models/MeetTheTeam');
const { uploadImage, deleteImage } = require('@imageHandler');

const imagePath = './storage/image/meetTheTeam/section0001';

// Get section data
const getSection = async (req, res) => {
  try {
    const data = await meetTheTeam.findOne({ 'section_0001._id': req.params.id });
    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(data.section_0001);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching section', error: error.message });
  }
};

// Update CTA
const updateSectionCta = async (req, res) => {
  try {
    const { text, url } = req.body;
    if (!text || !url) {
      return res.status(400).json({ message: 'CTA text and URL are required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'section_0001._id': req.params.id },
      { $set: { 'section_0001.cta': { text, url } } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0001);
  } catch (error) {
    res.status(500).json({ message: 'Error updating CTA', error: error.message });
  }
};

// Update title
const updateTitle = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'section_0001._id': req.params.id },
      { $set: { 'section_0001.title': title } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0001);
  } catch (error) {
    res.status(500).json({ message: 'Error updating title', error: error.message });
  }
};

// Update subtitle
const updateSubtitle = async (req, res) => {
  try {
    const { subtitle } = req.body;
    if (!subtitle) {
      return res.status(400).json({ message: 'Subtitle is required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'section_0001._id': req.params.id },
      { $set: { 'section_0001.subtitle': subtitle } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0001);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subtitle', error: error.message });
  }
};

// Update description
const updateDescription = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'section_0001._id': req.params.id },
      { $set: { 'section_0001.description': description } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0001);
  } catch (error) {
    res.status(500).json({ message: 'Error updating description', error: error.message });
  }
};

// Add team member
const addTeamMember = async (req, res) => {
  try {
    const { name, role } = req.body;
    const image = req.files?.image;

    if (!name || !role || !image) {
      return res.status(400).json({ message: 'Name, role, and image are required' });
    }

    // Check if section exists
    const sectionData = await meetTheTeam.findOne({ 'section_0001._id': req.params.id });
    if (!sectionData) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Upload image
    const timestamp = Date.now();
    const fileName = `${req.params.id}_${timestamp}`;
    const savedPath = uploadImage(image, fileName, imagePath);
    const image_url = savedPath;

    // Create full team member object
    const newTeamMember = { name, role, image_url };

    // Push team member to the correct section
    const updatedData = await meetTheTeam.findOneAndUpdate(
      { 'section_0001._id': req.params.id },
      { $push: { 'section_0001.team_members': newTeamMember } },
      { new: true }
    );

    res.json(updatedData.section_0001);

  } catch (error) {
    console.error('Add Team Member Error:', error);
    res.status(500).json({ message: 'Error adding team member', error: error.message });
  }
};

// Remove team member
const removeTeamMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId) {
      return res.status(400).json({ message: 'Team member ID is required' });
    }

    // Find the document and locate the team member
    const doc = await meetTheTeam.findOne({ 'section_0001._id': req.params.id });
    if (!doc) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const teamMember = doc.section_0001.team_members.find(member => String(member._id) === memberId);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Try to delete the image file
    if (teamMember.image_url) {
      try {
        const normalizedPath = path.resolve(teamMember.image_url);
        deleteImage(normalizedPath);
      } catch (err) {
        console.warn('Image deletion failed:', err.message);
        // Continue even if image deletion fails
      }
    }

    // Remove the team member from the array
    const updatedDoc = await meetTheTeam.findOneAndUpdate(
      { 'section_0001._id': req.params.id },
      { $pull: { 'section_0001.team_members': { _id: memberId } } },
      { new: true }
    );

    res.json(updatedDoc.section_0001);

  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ message: 'Error removing team member', error: error.message });
  }
};

module.exports = {
  getSection,
  updateSectionCta,
  updateTitle,
  updateSubtitle,
  updateDescription,
  addTeamMember,
  removeTeamMember,
};
