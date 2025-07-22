const path = require('path');
const meetTheTeam = require('@models/MeetTheTeam');
const { uploadImage, deleteImage } = require('@imageHandler');

const imagePath = './storage/image/meetTheTeam/section0004';

// Get section data
const getSection = async (req, res) => {
  try {
    const data = await meetTheTeam.findOne({ 'section_0004._id': req.params.id });
    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(data.section_0004);
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
      { 'section_0004._id': req.params.id },
      { $set: { 'section_0004.title': title } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(data.section_0004);
  } catch (error) {
    res.status(500).json({ message: 'Error updating title', error: error.message });
  }
};

// Add blog post
const addBlogPost = async (req, res) => {
  try {
    const { title, author_name, author_role, author_working } = req.body;
    const image = req.files?.image;

    if (!title || !author_name || !author_role || !author_working || !image) {
      return res.status(400).json({ message: 'Title, author name, role, working, and image are required' });
    }

    // Check if section exists
    const sectionData = await meetTheTeam.findOne({ 'section_0004._id': req.params.id });
    if (!sectionData) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Upload image
    const timestamp = Date.now();
    const fileName = `${req.params.id}_${timestamp}`;
    const savedPath = uploadImage(image, fileName, imagePath);
    const image_url = savedPath;

    // Create new blog post object
    const newBlogPost = {
      title,
      author: {
        name: author_name,
        role: author_role,
        working: author_working,
        image_url
      }
    };

    // Push blog post to the correct section
    const updatedData = await meetTheTeam.findOneAndUpdate(
      { 'section_0004._id': req.params.id },
      { $push: { 'section_0004.posts': newBlogPost } },
      { new: true }
    );

    res.json(updatedData.section_0004);

  } catch (error) {
    console.error('Add Blog Post Error:', error);
    res.status(500).json({ message: 'Error adding blog post', error: error.message });
  }
};

// Remove blog post
const removeBlogPost = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    // Find the document and locate the blog post
    const doc = await meetTheTeam.findOne({ 'section_0004._id': req.params.id });
    if (!doc) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const post = doc.section_0004.posts.find(p => String(p._id) === postId);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Try to delete the image file
    if (post.author.image_url) {
      try {
        const normalizedPath = path.resolve(post.author.image_url);
        deleteImage(normalizedPath);
      } catch (err) {
        console.warn('Image deletion failed:', err.message);
        // Continue even if image deletion fails
      }
    }

    // Remove the blog post from the array
    const updatedDoc = await meetTheTeam.findOneAndUpdate(
      { 'section_0004._id': req.params.id },
      { $pull: { 'section_0004.posts': { _id: postId } } },
      { new: true }
    );

    res.json(updatedDoc.section_0004);

  } catch (error) {
    console.error('Error removing blog post:', error);
    res.status(500).json({ message: 'Error removing blog post', error: error.message });
  }
};

module.exports = {
  getSection,
  updateSectionTitle,
  addBlogPost,
  removeBlogPost,
};