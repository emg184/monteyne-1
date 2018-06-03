var knex = require("../knex.js");

function Orders() {
  return knex('orders')
}

function cartDestructure(cart) {
  return cart.map( (obj) => {
          let keys = Object.keys(obj.details)
          let noActive = keys.filter((objKey) => objKey !== 'active')
          let noDescription = noActive.filter((objKey) => objKey !== 'description')
          let noSizes = noDescription.filter((objKey) => objKey !== 'sizes')
          let noImages = noSizes.filter((objKey) => objKey !== 'images')
          let noColors = noImages.filter((objKey) => objKey !== 'colors')
          let newObj = {}
          noColors.map((key) => {
            newObj[key] = obj.details[key]
          })
          obj.details = newObj
          return obj
        })
}

function newOrder(products, shipping_info, email, name, total) {
  return Orders()
          .insert({
            "products": products,
            "shipping_info": shipping_info,
            "email": email,
            "name": name,
            "total": total,
          })
}

function getOrders() {
  return Orders().orderBy('order_number', 'desc')
}

module.exports = {
  cartDestructure,
  newOrder,
  getOrders
}
