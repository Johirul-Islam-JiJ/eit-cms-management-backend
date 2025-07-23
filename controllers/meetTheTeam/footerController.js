const path = require('path');
const meetTheTeam = require('@models/MeetTheTeam');
const { uploadImage, deleteImage } = require('@imageHandler');

const imagePath = './storage/image/footer';

// Get footer data
const getFooter = async (req, res) => {
  try {
    const data = await meetTheTeam.findOne({ 'footer._id': req.params.id });
    if (!data) {
      return res.status(404).json({ message: 'Footer not found' });
    }
    res.json(data.footer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footer', error: error.message });
  }
};

// Update brand details
const updateBrand = async (req, res) => {
  try {
    const { name, slogan, address } = req.body;
    const image = req.files?.image;

    if (!name || !slogan || !address) {
      return res.status(400).json({ message: 'Name, slogan, and address are required' });
    }

    // Check if footer exists
    const footerData = await meetTheTeam.findOne({ 'footer._id': req.params.id });
    if (!footerData) {
      return res.status(404).json({ message: 'Footer not found' });
    }

    // Prepare brand update object
    const brandUpdate = { name, slogan, address };

    // Handle image upload if provided
    if (image) {
      // Delete old image if it exists
      if (footerData.footer.brand.image_url) {
        try {
          const normalizedPath = path.resolve(footerData.footer.brand.image_url);
          deleteImage(normalizedPath);
        } catch (err) {
          console.warn('Image deletion failed:', err.message);
          // Continue even if image deletion fails
        }
      }

      // Upload new image
      const timestamp = Date.now();
      const fileName = `${req.params.id}_${timestamp}`;
      const savedPath = uploadImage(image, fileName, imagePath);
      brandUpdate.image_url = savedPath;
    }

    // Update brand
    const updatedData = await meetTheTeam.findOneAndUpdate(
      { 'footer._id': req.params.id },
      { $set: { 'footer.brand': brandUpdate } },
      { new: true }
    );

    res.json(updatedData.footer);

  } catch (error) {
    console.error('Update Brand Error:', error);
    res.status(500).json({ message: 'Error updating brand', error: error.message });
  }
};

// Update sections
const addLinkToSection = async (req, res) => {
  try {
    const { section, name, link } = req.body;
    
    // --- Validation ---
    if (!section || !name || !link) {
      return res.status(400).json({ message: 'Fields "section", "name", and "link" are required.' });
    }

    const validSections = ['company', 'service', 'support'];
    if (!validSections.includes(section)) {
      return res.status(400).json({ message: 'Section must be one of: company, service, support.' });
    }
    
    // --- Database Operation ---
    // Dynamically create the path for the update
    const updatePath = `footer.sections.${section}`;
    
    const updatedSettings = await meetTheTeam.findOneAndUpdate(
      { 'footer._id': req.params.id },
      { 
        $push: { 
          [updatePath]: { name, link } 
        } 
      },
      { new: true, runValidators: true } // `new: true` returns the modified document
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: 'Document not found with that ID.' });
    }

    res.status(200).json({
        message: `Successfully added link to '${section}' section.`,
        footer: updatedSettings.footer
    });

  } catch (error) {
    console.error('Error adding link:', error);
    res.status(500).json({ message: 'Error adding link to section.', error: error.message });
  }
};

const removeLinkFromSection = async (req, res) => {
  try {
    const { section, itemId } = req.body;
    const { id } = req.params; // This is expected to be footer._id

    // --- Validation ---
    if (!section || !itemId) {
      return res.status(400).json({ message: 'Fields "section" and "itemId" are required.' });
    }

    const validSections = ['company', 'service', 'support'];
    if (!validSections.includes(section)) {
      return res.status(400).json({ message: 'Section must be one of: company, service, support.' });
    }

    // --- Database Operation ---
    const updatePath = `footer.sections.${section}`;

    const updatedSettings = await meetTheTeam.findOneAndUpdate(
      { 'footer._id': id },
      {
        $pull: {
          [updatePath]: { _id: itemId }
        }
      },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: 'Document not found with that footer._id.' });
    }

    res.status(200).json({
      message: `Successfully removed link from '${section}' section.`,
      footer: updatedSettings.footer
    });

  } catch (error) {
    console.error('Error removing link:', error);
    res.status(500).json({ message: 'Error removing link from section.', error: error.message });
  }
};

// Update social media links
const updateSocialLinks = async (req, res) => {
  try {
    const { facebook, globe } = req.body;
    if (!facebook || !globe) {
      return res.status(400).json({ message: 'Facebook and globe links are required' });
    }

    const updatedData = await meetTheTeam.findOneAndUpdate(
      { 'footer._id': req.params.id },
      { $set: { 'footer.social': { facebook, globe } } },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: 'Footer not found' });
    }

    res.json(updatedData.footer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating social links', error: error.message });
  }
};

module.exports = {
  getFooter,
  updateBrand,
  addLinkToSection,
  removeLinkFromSection,
  updateSocialLinks,
};