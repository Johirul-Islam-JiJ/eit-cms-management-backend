const meetTheTeam = require('../../models/MeetTheTeam');
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



module.exports = { index, initialize};
