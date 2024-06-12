const express = require("express");
const productController = require("../controllers/productController");
const uploadImage = require("../middleware/uploadImage");
const authentication = require("../middleware/authentication");

const router = express.Router();

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [products]
 *     summary: Returns all products
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
 *     tags: [products]
 *     summary: Create a product(Admin and Seller)
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               quantity:
 *                 type: number
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     security:
 *       - AdminKeyAuth: []
 *       - UserKeyAuth: []
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '401':
 *         description: Unauthorized, access denied
 *       '403':
 *         description: Forbidden, access denied
 *       '404':
 *         description: User not found
 */
router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authentication.verify,
    authentication.restrictTo("admin", "seller"),
    uploadImage.fields([
      { name: "image", maxCount: 5 },
      { name: "coverImage", maxCount: 1 },
    ]),
    productController.createProduct,
  );

/**
 * @openapi
 * /products/{productId}:
 *   patch:
 *     tags: [products]
 *     summary: Update quantity of a product (Admin only)
 *     security:
 *       - AdminKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 default: 5
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *       '401':
 *         description: Unauthorized, access denied
 *       '403':
 *         description: Forbidden, access denied
 *       '404':
 *         description: Not found
 *
 *   put:
 *     tags: [products]
 *     summary: Update a product (Admin only)
 *     security:
 *       - AdminKeyAuth: []
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
 *               description:
 *                 type: string
 *               quantity:
 *                 type: number
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *       '401':
 *         description: Unauthorized, access denied
 *       '403':
 *         description: Forbidden, access denied
 *       '404':
 *         description: Not found
 *
 *   delete:
 *     tags: [products]
 *     summary: Delete a product by ID (Admin only)
 *     security:
 *       - AdminKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Product deleted successfully
 *       '401':
 *         description: Unauthorized, access denied
 *       '403':
 *         description: Forbidden, access denied
 *       '404':
 *         description: Product not found
 */
router
  .route("/:productId")
  .patch(
    authentication.verify,
    authentication.restrictTo("admin", "seller"),
    productController.updateProductQantity,
  )
  .put(
    authentication.verify,
    authentication.restrictTo("admin", "seller"),
    productController.updateProduct,
  )
  .delete(productController.deleteProduct);

/**
 * @openapi
 * /products/search:
 *   get:
 *     tags: [products]
 *     summary: filter the products
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: productType
 *         schema:
 *           type: string
 *           default: Electronic
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: quantity
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
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
 *       '404':
 *         description: User not found
 */
router.get("/search", productController.filterProducts);

/**
 * @openapi
 * /products/out-of-stock:
 *   get:
 *     tags: [products]
 *     summary: Returns all out of stock products
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
 */
router.get("/out-of-stock", productController.outOfStock);

module.exports = router;
