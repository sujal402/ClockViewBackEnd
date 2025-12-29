const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} time: ${new Date().toISOString()}`);
  next();
};

export default logger;
