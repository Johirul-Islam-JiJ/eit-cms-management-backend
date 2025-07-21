const AboutUsWebSiteTemplate1 = require('../models/AboutUsWebSiteTemplate1');

const index = async (req, res) => {
  try {
    const data = await AboutUsWebSiteTemplate1.find();
    if (!data.length) {
      return res.status(404).json({ message: 'No data found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

const store = async (req, res) => {
  try {
    // console.log(typeof AboutUsWebSiteTemplate1); // should be 'function'
    // console.log(Object.keys(AboutUsWebSiteTemplate1)); // should include 'create', 'find', etc.
    const newData = new AboutUsWebSiteTemplate1(req.body);
    const saved = await newData.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error creating data', error: error.message });
  }
};


const initialize = async (req , res) => {
  try {
    await AboutUsWebSiteTemplate1.deleteMany({});
    const data = await AboutUsWebSiteTemplate1.create(require('../json/AboutUs.json'));
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error initializing data', error: error.message });
  }
};

module.exports = { index, store, initialize };
