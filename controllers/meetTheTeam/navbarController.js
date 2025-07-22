const path = require('path');
const meetTheTeam = require('@models/MeetTheTeam');

// Get navbar data
const navbar = async (req, res) => {
  try {
    const data = await meetTheTeam.findOne({ 'navbar._id': req.params.id });
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data.navbar);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching navbar', error: error.message });
  }
};

// Update brand name
const updateBrandName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'navbar._id': req.params.id },
      { $set: { 'navbar.brand.name': name } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json(data.navbar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating brand name', error: error.message });
  }
};

// Update CTA
const updateCta = async (req, res) => {
  try {
    const { text, url } = req.body;
    if (!text || !url) {
      return res.status(400).json({ message: 'CTA text and URL are required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'navbar._id': req.params.id },
      { $set: { 'navbar.cta': { text, url } } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json(data.navbar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating CTA', error: error.message });
  }
};

// Add link
const addLink = async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ message: 'Link is required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'navbar._id': req.params.id },
      { $push: { 'navbar.links': link } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json(data.navbar);
  } catch (error) {
    res.status(500).json({ message: 'Error adding link', error: error.message });
  }
};

// Remove link
const removeLink = async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ message: 'Link is required' });
    }

    const data = await meetTheTeam.findOneAndUpdate(
      { 'navbar._id': req.params.id },
      { $pull: { 'navbar.links': link } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json(data.navbar);
  } catch (error) {
    res.status(500).json({ message: 'Error removing link', error: error.message });
  }
};

module.exports = { navbar, updateBrandName, updateCta, addLink, removeLink };