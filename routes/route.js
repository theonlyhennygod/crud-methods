const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const itemController = require('../controllers/itemController')
const req = require('express/lib/request')
const validate = require('../middlewares/validate')
const itemSchema = require('../validation/item')

// CREATE
router.post('/', itemController.createItem)

// READ (all)
router.get('/', itemController.getAllItems)

// READ (one)
router.get('/:id', itemController.getItemById)

// UPDATE
router.put('/:id', itemController.updateItem)

// DELETE
router.delete('/:id', itemController.deleteItem)

// READ (one by name)
router.get('/name/:name', itemController.getItemByName)

// input validation with Joi
router.post('/', validate(itemSchema), itemController.createItem)

// input validation with express-validator
router.post(
    '/',
    [
        check('name').not().isEmpty().withMessage('Name is required'),
        check('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),
        check('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    itemController.createItem
);



module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the item
 *         name:
 *           type: string
 *           description: The name of the item
 *         description:
 *           type: string
 *           description: The item description
 *         quantity:
 *           type: integer
 *           description: The quantity of the item
 *       example:
 *         id: d5fE_asz
 *         name: Item 1
 *         description: This is item 1
 *         quantity: 10
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Returns the list of all the items
 *     responses:
 *       200:
 *         description: The list of the items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
