const express = require("express");
const cartController = require("../controllers/cartController");
const authentication = require("../middleware/authentication");

const router = express.Router();

/**
 * @openapi
 * /carts:
 *   get:
 *     tags: [carts]
 *     summary: Returns all carts
 *     security:
 *       - AdminKeyAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   default: success
 *                 result:
 *                   type: integer
 *                 data:
 *                   default: []
 *       '401':
 *         description: You are not logged in! Please login to get access
 *       '403':
 *         description: You do not have permission to perform this task
 */
router.get(
  "/",
  authentication.verify,
  authentication.restrictTo("admin"),
  cartController.getAllCarts,
);

/**
 * @openapi
 * /carts/view:
 *   get:
 *     tags: [carts]
 *     summary: Returns all carts of a user
 *     security:
 *       - UserKeyAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   default: success
 *                 result:
 *                   type: integer
 *                 data:
 *                   default: []
 *       '401':
 *         description: You are not logged in! Please login to get access
 *       '403':
 *         description: You do not have permission to perform this task
 */
router.get("/view", authentication.verify, cartController.getUserCart);

/**
 * @openapi
 * /carts/add-to-cart:
 *   post:
 *     tags: [carts]
 *     summary: add to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   default: success
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized, access denied
 *       404:
 *         description: Not Found
 */
router.post("/add-to-cart", authentication.verify, cartController.addToCart);

/**
 * @openapi
 * /carts/check-for-abandoned-carts:
 *   get:
 *     tags: [carts]
 *     summary: decide if cart is abandoned or not
 *     description: carts is abandoned if last_activity_time of cart is less than 1 minutes
 *     security:
 *       - AdminKeyAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   default: success
 *                 result:
 *                   type: integer
 *                 data:
 *                   default: []
 *       '401':
 *         description: You are not logged in! Please login to get access
 *       '403':
 *         description: You do not have permission to perform this task
 */
router.get(
  "/check-for-abandoned-carts",
  authentication.verify,
  authentication.restrictTo("admin"),
  cartController.checkForAbandonedCarts,
);

module.exports = router;
