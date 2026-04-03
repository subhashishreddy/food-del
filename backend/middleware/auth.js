import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(400).json({
      status: "failed",
      message: "Not Authorized, Login again",
    });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRETE);
    req.user = { userId: token_decode.id };
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export default authMiddleware;
