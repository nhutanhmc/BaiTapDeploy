const express = require('express');
const router = express.Router();
const ProductController = require('../controller/ProductController');
const upload = require("../config/uploadMiddleware");
const mongoose = require('mongoose'); // Add this line

const ProductSchema = require('../model/productModel'); // Import ProductSchema

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - imageLink
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product.
 *         size:
 *           type: string
 *           description: The size of the product.
 *         weight:
 *           type: number
 *           description: The weight of the product.
 *         description:
 *           type: string
 *           description: The description of the product.
 *         price:
 *           type: number
 *           description: The price of the product.
 *         color:
 *           type: string
 *           description: The color of the product.
 *         materialID:
 *           type: string
 *           format: uuid
 *           description: The ID of the material associated with the product.
 *         gemstoneID:
 *           type: string
 *           format: uuid
 *           description: The ID of the gemstone associated with the product.
 *         productTypeID:
 *           type: string
 *           format: uuid
 *           description: The ID of the product type associated with the product.
 *         imageLink:
 *           type: string
 *           description: The link to the image of the product.
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Upload a product image
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request (e.g., missing image or invalid format)
 *       500:
 *         description: Internal server error
 */
router.post('/', upload.single('image'), ProductController.uploadImage_Api);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', ProductController.getAllProduct_Api);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', ProductController.deleteProduct_Api);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', ProductController.updateProduct_Api);

module.exports = router;