module.exports = (req, res, next) => {
  res.render('index', {message: 'Hello, World!'});
};
