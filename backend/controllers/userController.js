import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETE);
};

//login user function
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid Credentials or register",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "success",
        message: "Invalid Credentials",
      });
    }

    const token = createToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

//registered User
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    //get the user if exists and send response.
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(200).json({
        status: "success",
        message: "user is already exists",
      });
    }

    //validating email format and strong pssword
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "failed",
        message: "Please enter valid email",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        status: "success",
        message: "password must be greater than 8 characters",
      });
    }

    //hashing user paassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export { loginUser, registerUser };
