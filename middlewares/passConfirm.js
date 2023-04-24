exports.passConfirm = (req, res, next) => {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  if (password !== passwordConfirm) {
    return res.status(400).json({
      status: 'Fail',
      msg: 'Passwords are not the same',
    });
  }
  return next();
};
