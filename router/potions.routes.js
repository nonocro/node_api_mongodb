import { Router } from 'express';
const potions_router = Router();
import { Potion } from '../models/potion.model.js';
import authMiddleware from '../services/auth.middleware.js';

potions_router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Potions
 *   description: Potion management and analytics
 */

/**
 * @swagger
 * /potions:
 *   get:
 *     summary: Get all potions
 *     tags: [Potions]
 *     responses:
 *       200:
 *         description: List of all potions.
 *       500:
 *         description: Server error.
 */
potions_router.get('/', async (req, res) => {
    try {
      const potions = await Potion.find();
      res.json(potions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/names:
 *   get:
 *     summary: Get names of all potions
 *     tags: [Potions]
 *     responses:
 *       200:
 *         description: List of potion names.
 *       500:
 *         description: Server error.
 */
potions_router.get('/names', async (req, res) => {
    try {
        const names = await Potion.find({}, 'name');
        res.json(names.map(p => p.name));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/vendor/{vendor_id}:
 *   get:
 *     summary: Get all potions by a specific vendor
 *     tags: [Potions]
 *     parameters:
 *       - in: path
 *         name: vendor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vendor
 *     responses:
 *       200:
 *         description: List of potions by the vendor.
 *       500:
 *         description: Server error.
 */
potions_router.get('/vendor/:vendor_id', async (req, res) => {
    try {
      const potions = await Potion.find({ vendor_id: req.params.vendor_id });
      res.json(potions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/price-range:
 *   get:
 *     summary: Get potions within a price range
 *     tags: [Potions]
 *     parameters:
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         description: Maximum price
 *     responses:
 *       200:
 *         description: List of potions within the price range.
 *       500:
 *         description: Server error.
 */
potions_router.get('/price-range', async (req, res) => {
    try {
      const { min, max } = req.query;
      const potions = await Potion.find({ price: { $gte: min, $lte: max } })
      res.json(potions);
    } catch (err) {
res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /potions/{id}:
 *   get:
 *     summary: Get a potion by ID
 *     tags: [Potions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the potion
 *     responses:
 *       200:
 *         description: Potion details.
 *       404:
 *         description: Potion not found.
 *       500:
 *         description: Server error.
 */
potions_router.get('/:id', async (req, res) => {
    try {
      const potion = await Potion.findById(req.params.id);
      if (!potion) return res.status(404).json({ message: 'Potion not found' });
      res.json(potion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}
);

/**
 * @swagger
 * /potions:
 *   post:
 *     summary: Create a new potion
 *     tags: [Potions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               score:
 *                 type: number
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               ratings:
 *                 type: object
 *                 properties:
 *                   strength:
 *                     type: number
 *                   flavor:
 *                     type: number
 *               tryDate:
 *                 type: string
 *                 format: date
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               vendor_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Potion created successfully.
 *       400:
 *         description: Validation error.
 */
potions_router.post('/', async (req, res) => {
  console.log(req.body);
    try {
        const newPotion = new Potion(req.body);
        const savedPotion = await newPotion.save();
        res.status(201).json(savedPotion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/{id}:
 *   put:
 *     summary: Update a potion by ID
 *     tags: [Potions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the potion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               score:
 *                 type: number
 *     responses:
 *       200:
 *         description: Potion updated successfully.
 *       404:
 *         description: Potion not found.
 *       400:
 *         description: Validation error.
 */
potions_router.put('/:id', async (req, res) => {
    try {
        const potion = await Potion.updateOne({ _id: req.params.id }, req.body);
        if (!potion) return res.status(404).json({ message: 'Potion not found' });
        res.json({ message: 'Potion updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /potions/{id}:
 *   delete:
 *     summary: Delete a potion by ID
 *     tags: [Potions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the potion
 *     responses:
 *       200:
 *         description: Potion deleted successfully.
 *       404:
 *         description: Potion not found.
 *       500:
 *         description: Server error.
 */
potions_router.delete('/:id', async (req, res) => {
    try {
        const potion = await Potion.findByIdAndDelete(req.params.id);
        if (!potion) return res.status(404).json({ message: 'Potion not found' });
        res.json({ message: 'Potion deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default potions_router;
