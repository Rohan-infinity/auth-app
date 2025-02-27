import User from "../Models/User.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/errors.js";
import jwt from 'jsonwebtoken';

export const signup = async (req,res , next) => {
  const { username, email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword});
  try {
  await newUser.save();
  res.status(201).json({ message: "User Created Successfully"}); 
  } catch (error) {
    next(error);       
  }  
}; 

export const signin = async (req,res , next) => {
  const { email, password} = req.body;
  try {
    const validUser = await User.findOne({email});
    if(!validUser) return next(errorHandler(404, 'User Not Found'));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, 'Wrong Credentials'));
    //res.status(200).json({ _id: validUser._id, username: validUser.username, email: validUser.email});
    const token = jwt.sign({ _id: validUser._id}, process.env.JWT_SECRET);
    const {password: hashedPassword, ...others} = validUser._doc
    const expiryDate = new Date(Date.now() + 15 * 60 * 60 * 24);
    res.cookie('access_token', token, {httpOnly: true ,expires: expiryDate}).status(200).json(others);
  } catch (error) { 
    next(error);
  }
}