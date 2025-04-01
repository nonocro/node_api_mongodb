import { Router } from 'express';
const analytics_router = Router();
import { Potion } from '../models/potion.model.js';
import authMiddleware from '../services/auth.middleware.js';

analytics_router.use(authMiddleware);

/**
 * @swagger
 * /analytics/distinct-categories:
 *   get:
 *     summary: Get the total number of distinct categories
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: The total number of distinct categories
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *       500:
 *         description: Server error
 */
analytics_router.get('/distinct-categories', async (req, res) => {
    try {
      const categories = await Potion.distinct('categories');
      res.json(categories.length);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * @swagger
   * /analytics/average-score-by-vendor:
   *   get:
   *     summary: Get the average score by vendor
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: A list of vendors with their average scores
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   averageScore:
   *                     type: number
   *       500:
   *         description: Server error
   */
  analytics_router.get('/average-score-by-vendor', async (req, res) => {
    try {
      const vendors = await Potion.aggregate([
        { $group: { _id: "$vendor_id", averageScore: { $avg: "$score" } } }
      ]);
      res.json(vendors);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * @swagger
   * /analytics/average-score-by-category:
   *   get:
   *     summary: Get the average score by category
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: A list of categories with their average scores
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   averageScore:
   *                     type: number
   *       500:
   *         description: Server error
   */
  analytics_router.get('/average-score-by-category', async (req, res) => {
    try {
      const categories = await Potion.aggregate([
        { $unwind: "$categories" },
        { $group: { _id: "$categories", averageScore: { $avg: "$score" } } }
      ]);
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * @swagger
   * /analytics/strength-flavor-ratio:
   *   get:
   *     summary: Get the strength to flavor ratio for potions
   *     tags: [Analytics]
   *     responses:
   *       200:
   *         description: A list of potions with their strength to flavor ratio
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   strengthFlavorRatio:
   *                     type: number
   *       500:
   *         description: Server error
   */
  analytics_router.get('/strength-flavor-ratio', async (req, res) => {
    try {
      const potions = await Potion.aggregate([
        { $project: { strengthFlavorRatio: { $divide: ["$ratings.strength", "$ratings.flavor"] } } }
      ]);
      res.json(potions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
/**
 * @swagger
 * /analytics/search:
 *   get:
 *     summary: Group potions by vendor or category with a chosen metric and field
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [vendor_id, categories]
 *         description: The field to group by (vendor_id or categories)
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           enum: [avg, sum, count]
 *         description: The metric to use (avg, sum, count)
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *           enum: [score, price, ratings.strength, ratings.flavor]
 *         description: The field to apply the metric to (score, price, ratings)
 *     responses:
 *       200:
 *         description: A list of grouped potions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
analytics_router.get('/search', async (req, res) => {
  try {
    const { groupBy, metric, field } = req.query;

    // Define the aggregation pipeline
    const pipeline = [];

    // Add $unwind stage if grouping by categories
    if (groupBy === 'categories') {
      pipeline.push({ $unwind: '$categories' });
    }

    // Add $group stage
    const groupStage = {
      $group: {
        _id: `$${groupBy}`,
        ...(metric === 'count' && { count: { $sum: 1 } }),
        ...(metric !== 'count' && { [metric]: { [`$${metric}`]: `$${field}` } })
      }
    };
    pipeline.push(groupStage);

    // Execute the aggregation pipeline
    const potions = await Potion.aggregate(pipeline);

    res.json(potions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default analytics_router;