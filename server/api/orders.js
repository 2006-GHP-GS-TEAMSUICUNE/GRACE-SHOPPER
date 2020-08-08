const orderRouter = require('express').Router();
const { Order } = require('../db/models');

// if (user's) order.isPaid is set to true && user clicks on addTo Cart
orderRouter.post('/', async (req, res, next) => {
  try {
    const newOrder = await Order.create();
    res.json(newOrder);
  } catch (error) {
    next(error);
  }
});

orderRouter.put('/:orderId', async (req, res, next) => {
  try {
    const updatingThisOrder = await Order.findByPk(req.params.orderId);
    const newInfo = req.body;
    const updatedOrder = await updatingThisOrder.update(newInfo);
    updatedOrder.save();
    req.json(updatedOrder);
  } catch (error) {
    next(error);
  }
});

module.exports = orderRouter;