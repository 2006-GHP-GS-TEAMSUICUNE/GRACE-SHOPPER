const db = require('../db');
const { Product } = require('./product');
const Sequelize = require('sequelize');

const OrderItem = db.define('orderItem', {
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  subtotal: {
    type: Sequelize.INTEGER,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('subtotal');
      return rawValue ? rawValue / 100 : null;
    },
  },
});

// OrderItem.prototype.setSubTotal = function () {
//   const itemPrice = Product.findById(this.productId).price
//   this.subtotal = itemPrice * this.quantity
// }

module.exports = OrderItem;
