const mongoose = require('mongoose');

const aboutUsWebSiteTemplate1Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('AboutUsWebSiteTemplate1', aboutUsWebSiteTemplate1Schema);