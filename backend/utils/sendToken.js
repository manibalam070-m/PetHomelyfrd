const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user: {
      _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar,
    },
    token,
  });
};

export default sendToken;