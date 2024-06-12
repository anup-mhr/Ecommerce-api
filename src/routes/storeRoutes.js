const express = require("express");
const storeController = require("../controllers/storeController");
const uploadImage = require("../middleware/uploadImage");
const authentication = require("../middleware/authentication");

const router = express.Router();

/**
 * @openapi
 * /store:
 *   get:
 *     tags: [store]
 *     summary: Returns all store
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
 *
 *   post:
 *     tags: [store]
 *     summary: Create a store
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: number
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: string
 *               storeLogo:
 *                 type: string
 *                 format: binary
 *     security:
 *       - UserKeyAuth: []
 *     responses:
 *       '200':
 *         description: Success
 *       '401':
 *         description: Unauthorized, access denied
 *       '403':
 *         description: Forbidden, access denied
 *       '404':
 *         description: Not found
 */
router
  .route("/")
  .get(authentication.verify, authentication.restrictTo("admin"), storeController.getAllStore)
  .post(authentication.verify, uploadImage.single("storeLogo"), storeController.createStore);

/**
 * @openapi
 * /store/search:
 *   get:
 *     tags: [store]
 *     summary: Search store near 1Km
 *     security:
 *       - AdminKeyAuth: []
 *       - UserKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longitude:
 *                 type: number
 *                 default: 27.682169
 *               latitude:
 *                 type: number
 *                 default: 85.271563
 *     responses:
 *       '200':
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
 *       '401':
 *         description: Unauthorized, access denied
 *       '403':
 *         description: Forbidden, access denied
 *       '404':
 *         description: User not found
 */
router.get("/search", authentication.verify, storeController.findNearStores);

/**
 * @openapi
 * /store/{storeId}:
 *   get:
 *     tags: [store]
 *     summary: Returns all product of a store
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         description: ID of store
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
 *                   default: []
 *       401:
 *         description: You are not logged in! Please login to get access
 *       404:
 *         description: Not found
 */
router.get("/:storeId", authentication.verify, storeController.getStoreProducts);

module.exports = router;
