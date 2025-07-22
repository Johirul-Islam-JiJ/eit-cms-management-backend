const path = require('path');
const meetTheTeam = require('@models/MeetTheTeam');

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
    const { name, role, image_url } = req.body;
    if (!name || !role || !image_url) {
      return res.status(400).json({ message: 'Name, role, and image URL are required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'section_0001._id': req.params.id },
      { $push: { 'section_0001.team_members': { name, role, image_url } } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0001);
  } catch (error) {
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

    const data = await meetTheTeam.findOneAndUpdate(
      { 'section_0001._id': req.params.id },
      { $pull: { 'section_0001.team_members': { _id: memberId } } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0001);
  } catch (error) {
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