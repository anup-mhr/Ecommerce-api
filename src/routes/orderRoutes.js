const express = require("express");
const orderController = require("../controllers/orderController");
const authentication = require("../middleware/authentication");

const router = express.Router();

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [orders]
 *     summary: Returns all orders
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
  orderController.getAllOrders,
);

/**
 * @openapi
 * /orders/checkout:
 *   post:
 *     tags: [orders]
 *     summary: checkout the cart of user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: number
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
 *                   default: Order has been placed
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized, access denied
 */
router.post("/checkout", authentication.verify, orderController.checkoutOrder);

module.exports = router;
