// middleware/logger.js

const logger = (req, res, next) => {
  res.requestTime = new Date().toISOString();
  console.log(`time: ${res.requestTime} | method: ${req.method} | request for '${req.url}'`);
  next();
};

module.exports = logger;
