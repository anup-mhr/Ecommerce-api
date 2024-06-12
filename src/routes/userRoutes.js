const express = require("express");
const userController = require("../controllers/userController");
const authController = require("./../controllers/authController");
const authentication = require("../middleware/authentication");

const router = express.Router();

/**
 * @openapi
 * /users/signup:
 *   post:
 *     tags: [users]
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 require: true
 *               password:
 *                 type: string
 *                 format: password
 *                 require: true
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
 *                 token:
 *                   type: string
 *                   default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDg4MzJiMDU0NzIzMWIwZDIxNjI4ZSIsImlhdCI6MTcwOTU1MTM0MCwiZXhwIjoxNzA5NjM3
 *                 data:
 *                   default: {}
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, access denied
 *       '403':
 *         description: Forbidden, access denied
 */
router.post("/signup", authController.signup);

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [users]
 *     summary: login into system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
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
 *                 token:
 *                   type: string
 *                   default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDg4MzJiMDU0NzIzMWIwZDIxNjI4ZSIsImlhdCI6MTcwOTU1MTM0MCwiZXhwIjoxNzA5NjM3
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized, access denied
 */
router.post("/login", authController.login);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [users]
 *     summary: Returns all users
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
 */
router
  .route("/")
  .get(authentication.verify, authentication.restrictTo("admin"), userController.getAllUsers);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [users]
 *     summary: Update a user by ID (Admin only)
 *     security:
 *       - AdminKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username for the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The new email for the user
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '401':
 *         description: Unauthorized, access denied
 *       '403':
 *         description: Forbidden, access denied
 *       '404':
 *         description: User not found
 *
 *   delete:
 *     tags: [users]
 *     summary: Delete a user by ID (Admin only)
 *     security:
 *       - AdminKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized, access denied
 *       '403':
 *         description: Forbidden, access denied
 *       '404':
 *         description: User not found
 */
router
  .route("/:id")
  .put(authentication.verify, authentication.restrictTo("admin"), userController.updateUser)
  .delete(authentication.verify, authentication.restrictTo("admin"), userController.deleteUser);

module.exports = router;
