var knex = require("../knex.js");

function Products() {
  return knex('products');
};

function Images() {
  return knex('images');
};

function getAllProducts(category_id) {
  return Products()
          .where({
            'category_id' : category_id
          });
};

function getAllProductsImages(prod_id) {
  return Images()
          .where({
            'product_id' : prod_id
          });
};

function getProduct(prod_id) {
  return Products()
          .where({
            'product_id': prod_id,
          })
}

function getProductImages(prod_id) {
  return Images()
          .where({
            'product_id': prod_id
          })
}

function deleteProduct(prod_id) {
  return Products()
          .where({
            'product_id': prod_id
          })
            .del()
}

function deleteImages(prod_id) {
  return Images()
          .where({
            'product_id': prod_id
          })
            .del()
}

function deleteImage(image_id) {
  return Images()
            .where({
              'image_id': image_id
            })
              .del()
}

function updateProduct(prod_id, name, category, status=true, desc, price, color='', size='', customs='', sku='') {
  return Products()
          .where({
            'product_id': prod_id
          })
            .update({
              'product_name': name,
              'category_id': category,
              'active': status,
              'description': desc,
              'price': price,
              'colors': color,
              'sizes': size,
              'custom_fields': customs,
              'sku': sku
            })
}


function updateImage(id, name, prod_id, status=true, url, associations) {
  return Images()
          .where({
            'image_id': id
          })
            .update({
              'image_name': name,
              'product_id': prod_id,
              'active': status,
              'image_url': url,
              'associations': associations
            })
}

function activateProduct(id) {
  return Products()
          .where({
            'image_id': id
          })
            .update({
              'active': true
            })
}

function deactivateProduct(id) {
  return Products()
          .where({
            'image_id': id
          })
            .update({
              'active': false
            })
}

function activateImage(id) {
  return Images()
          .where({
            'image_id': id
          })
            .update({
              'active': true
            })
}

function deactivateImage(id) {
  return Images()
          .where({
            'image_id': id
          })
            .update({
              'active': false
            })
}

function addProduct(name, category, status=true, desc, price, color='', size='', customs='', sku='') {
  return Products()
          .insert({
            'product_name': name,
            'category_id': category,
            'active': status,
            'description': desc,
            'price': price,
            'colors': color,
            'sizes': size,
            'custom_fields': customs,
            'sku': sku
          })
}

function addImage(name, prod_id, status=true, url, associations) {
  return Images()
          .insert({
            'image_name': name,
            'product_id': prod_id,
            'active': status,
            'image_url': url,
            'associations': associations
          })
}


function whereInProducts(catArray) {
   return knex.select().from('products')
            .whereIn('category_id', catArray)
              .then((res) => {
                return Promise.all(res.map( product => {
                  return getProductImages(product.product_id)
                          .then( image => {
                            product['images'] = image
                            return product
                          })
                })
              )
            })
}



module.exports = {
  Products: Products,
  getAllProducts: getAllProducts,
  getAllProductsImages: getAllProductsImages,
  getProductImages: getProductImages,
  getProduct: getProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  deleteImages: deleteImages,
  deleteImage: deleteImage,
  updateImage: updateImage,
  activateProduct: activateProduct,
  deactivateProduct: deactivateProduct,
  activateImage: activateImage,
  deactivateImage: deactivateImage,
  addProduct: addProduct,
  addImage: addImage,
  whereInProducts: whereInProducts
};
