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
const updateSections = async (req, res) => {
  try {
    const { company, service, support } = req.body;
    if (!company || !service || !support) {
      return res.status(400).json({ message: 'Company, service, and support sections are required' });
    }

    const updatedData = await meetTheTeam.findOneAndUpdate(
      { 'footer._id': req.params.id },
      { 
        $set: { 
          'footer.sections.company': company,
          'footer.sections.service': service,
          'footer.sections.support': support
        } 
      },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: 'Footer not found' });
    }

    res.json(updatedData.footer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating sections', error: error.message });
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
  updateSections,
  updateSocialLinks,
};