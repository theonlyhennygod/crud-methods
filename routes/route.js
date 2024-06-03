const express = require('express')
const router = express.Router()
const itemController = require('../controllers/itemController')

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


module.exports = router;