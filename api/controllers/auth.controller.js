import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json('User created successfully!');
    } catch (error) {
        next(error);
    }
  };

export const login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const validUser = await User.findOne({ username });
        if (!validUser) return next(errorHandler(404, "User not found!"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
        const token = jwt.sign({ id: validUser._id }, process.env.SECRET_KEY);
        const { password: pass, ...info } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(info);
    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(user){
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
            const { password: pass, ...info } = user._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(info);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 12);
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase()+ Math.random().toString(36).slice(-4) , 
                                       email: req.body.email, 
                                       password: hashedPassword ,
                                       avatar: req.body.photo});
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);
            const { password: pass, ...info } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(info);

        }
    }catch(error){
        next(error);
    }
}