const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      department: user.department,
      email: user.email,
      password: user.password,
      role: user.role,
    },
    process.env.KEY_ACCESS,
    {
      expiresIn: "15min",
    }
  );
  return accessToken;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      department: user.department,
      email: user.email,
      role: user.role,
    },
    process.env.KEY_REFRESH
  );
  return refreshToken;
};

const validateToken = (req, res, next) => {
  // console.log("REQ: ", req.headers)
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log(token)
    jwt.verify(token, process.env.KEY_ACCESS, (error, user) => {
      if (error) {
        const message = "Invalid token.";
        res.status(400).json({ message });
      }
      req.user = user;
      next();
    });
  } else {
    const message = "Not authenticated.";
    res.status(400).json({ message });
  }
};

module.exports = { generateAccessToken, generateRefreshToken, validateToken };
