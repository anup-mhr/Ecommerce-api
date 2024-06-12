const express = require("express");
const auctionController = require("../controllers/auctionController");
const authentication = require("../middleware/authentication");

const router = express.Router();

/**
 * @openapi
 * /auctions:
 *   get:
 *     tags: [auction]
 *     summary: Returns all auctions
 *     security:
 *       - AdminKeyAuth: []
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
 *       401:
 *         description: You are not logged in! Please login to get access
 *       403:
 *         description: You do not have permission to perform this task
 */
router.get("/", authentication.verify, auctionController.getAllAuctions);

/**
 * @openapi
 * /auctions/{auctionId}:
 *   get:
 *     tags: [auction]
 *     summary: Returns auction by auctionId
 *     parameters:
 *       - in: path
 *         name: auctionId
 *         required: true
 *         description: ID of the auction
 *         schema:
 *           type: string
 *     security:
 *       - AdminKeyAuth: []
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
 *                 data:
 *                   type: object
 *       401:
 *         description: You are not logged in! Please login to get access
 *       403:
 *         description: You do not have permission to perform this task
 *       404:
 *         description: Not Found
 */
router.get("/:auctionId", authentication.verify, auctionController.getAuctionById);

/**
 * @openapi
 * /auctions/{productId}:
 *   post:
 *     tags: [auction]
 *     summary: Add product to auction
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the auction
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endDate:
 *                 type: string
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
 *                 data:
 *                   type: object
 *       401:
 *         description: You are not logged in! Please login to get access
 *       403:
 *         description: You do not have permission to perform this task
 *       404:
 *         description: Not Found
 */
router.post(
  "/:productId",
  authentication.verify,
  authentication.restrictTo("admin", "seller"),
  auctionController.addAuction,
);

/**
 * @openapi
 * /auctions/bid/{auctionId}:
 *   get:
 *     tags: [auction]
 *     summary: Get bidder of a auction
 *     parameters:
 *       - in: path
 *         name: auctionId
 *         required: true
 *         description: ID of the auction
 *         schema:
 *           type: string
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
 *       401:
 *         description: You are not logged in! Please login to get access
 *       403:
 *         description: You do not have permission to perform this task
 *       404:
 *         description: Not Found
 *
 *   post:
 *     tags: [auction]
 *     summary: Bid of a auction by user
 *     parameters:
 *       - in: path
 *         name: auctionId
 *         required: true
 *         description: ID of the auction
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bid_amount:
 *                 type: number
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
 *                 data:
 *                   type: object
 *       401:
 *         description: You are not logged in! Please login to get access
 *       403:
 *         description: You do not have permission to perform this task
 *       404:
 *         description: Not Found
 */
router
  .route("/bid/:auctionId")
  .get(
    authentication.verify,
    authentication.restrictTo("admin", "seller"),
    auctionController.getBidders,
  )
  .post(authentication.verify, auctionController.bidAuction);

/**
 * @openapi
 * /auctions/calculate/{auctionId}:
 *   get:
 *     tags: [auction]
 *     summary: Decide the winner of Auction (Admin only)
 *     parameters:
 *       - in: path
 *         name: auctionId
 *         required: true
 *         description: ID of the auction
 *         schema:
 *           type: string
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
 *                 data:
 *                   type: object
 *       401:
 *         description: You are not logged in! Please login to get access
 *       403:
 *         description: You do not have permission to perform this task
 *       404:
 *         description: Not Found
 */
router.get(
  "/calculate/:auctionId",
  authentication.verify,
  authentication.restrictTo("admin", "seller"),
  auctionController.decideAuctionWinner,
);

module.exports = router;
