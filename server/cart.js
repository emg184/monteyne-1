const data = require('./app.js');
var cartData = data.cart.products;

/*
cartData.filter( product => {
  console.log(product)
  return product
  //return product !== images;
})
*/

let newData = cartData.map( (obj) => {
  let keys = Object.keys(obj.details)
  keysToFilter = ['active', 'description', 'sizes']
  let noActive = keys.filter((objKey) => {
      return objKey !== 'active'
  })
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
