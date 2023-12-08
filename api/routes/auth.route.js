import express from 'express';
import { google, login, signup, signOut, setRole } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", google);
router.get('/signout', signOut);
router.post('/signup/setRole/:userId', setRole);

export default router;