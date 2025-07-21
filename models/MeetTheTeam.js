const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  image_url: String
});

const DepartmentSchema = new mongoose.Schema({
  name: String,
  description: String,
  image_url: String
});

const CultureImageSchema = new mongoose.Schema({
  image_url: String,
  description: String
});

const BlogAuthorSchema = new mongoose.Schema({
  name: String,
  role: String,
  working: String,
  image_url: String
});

const BlogPostSchema = new mongoose.Schema({
  title: String,
  author: BlogAuthorSchema
});

const CTASectionSchema = new mongoose.Schema({
  section_code: String,
  title: String,
  subtitle: String,
  description: String,
  team_members: [TeamMemberSchema],
  cta: {
    text: String,
    url: String
  }
});

const DepartmentSectionSchema = new mongoose.Schema({
  section_code: String,
  title: String,
  departments: [DepartmentSchema]
});

const CultureSectionSchema = new mongoose.Schema({
  section_code: String,
  title: String,
  images: [CultureImageSchema]
});

const BlogSectionSchema = new mongoose.Schema({
  section_code: String,
  title: String,
  posts: [BlogPostSchema]
});

const WebsiteSchema = new mongoose.Schema({
  website_name: { type: String, required: true },
  file_path: { type: String, required: true },

  navbar: {
    brand: {
      name: String
    },
    links: [String],
    cta: {
      text: String,
      url: String
    }
  },

  sections_0001: CTASectionSchema,
  sections_0002: DepartmentSectionSchema,
  sections_0003: CultureSectionSchema,
  sections_0004: BlogSectionSchema,

  footer: {
    brand: {
      name: String,
      slogan: String,
      address: String
    },
    sections: {
      company: [String],
      service: [String],
      support: [String]
    },
    social: {
      facebook: String,
      globe: String
    }
  }
});

module.exports = mongoose.model('MeetTheTeam', WebsiteSchema);
