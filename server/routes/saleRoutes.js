const express = require('express');
const router = express.Router();
const {
    createSale,
    getSales,
    getSale,
    getDailySales
} = require('../controllers/saleController');

router.get('/daily', getDailySales);
router.get('/', getSales);
router.get('/:id', getSale);
router.post('/', createSale);

module.exports = router;
