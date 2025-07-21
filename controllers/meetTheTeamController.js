const meetTheTeam = require('../models/MeetTheTeam');
const { body, query, param, validationResult } = require('express-validator');

const index = async (req, res) => {
  try {
    const data = await meetTheTeam.find();
    if (!data.length) {
      return res.status(404).json({ message: 'No data found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};



const initialize = async (req , res) => {
  try {
    await meetTheTeam.deleteMany({});
    const data = await meetTheTeam.create(require('../json/MeetTheTeam.json'));
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error initializing data', error: error.message });
  }
};


const updateNavbar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.params.id);
    const data = await meetTheTeam.findOne({ 'navbar._id': req.params.id });

   // const data = await meetTheTeam.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    //Merge update
    Object.assign(data.navbar, req.body);
    await data.save();

    res.json(data.navbar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating navbar', error: error.message });
  }
};

// Update Section 0001 (Meet the Team)
const updateSection0001 = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const data = await meetTheTeam.findOne({ 'section_0001._id': req.params.id });
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    //Merge update
    // Object.assign(data.section_0001, req.body);
    // await data.save();

    res.json(data.section_0001);
  } catch (error) {
    res.status(500).json({ message: 'Error updating section', error: error.message });
  }
};


module.exports = { index, initialize, updateNavbar, updateSection0001 };
