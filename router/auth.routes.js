import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user.model.js';

const auth_router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const COOKIE_NAME = process.env.COOKIE_NAME || 'demo_node+mongo_token';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: System error.
 */
auth_router.post('/register', [
    body('username').trim().escape()
      .notEmpty().withMessage('Le nom d’utilisateur est requis.')
      .isLength({ min: 3, max: 30 }).withMessage('Doit faire entre 3 et 30 caractères.'),
    body('password').trim().escape()
      .notEmpty().withMessage('Le mot de passe est requis.')
      .isLength({ min: 6 }).withMessage('Minimum 6 caractères.')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password } = req.body;
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: 'Utilisateur créé' });
    } catch (err) {
      if (err.code === 11000) return res.status(500).json({ error: err.message });
      res.status(400).json({ error: err.message });
    }
  });

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *       401:
 *         description: Invalid credentials.
 */
auth_router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // à mettre sur true en prod (https)
      maxAge: 24 * 60 * 60 * 1000 // durée de vie 24h
    });

    res.json({ message: 'Connecté avec succès' });
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out.
 */
auth_router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ message: 'Déconnecté' });
});

export default auth_router;