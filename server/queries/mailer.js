const creds = require('../config');

function createEmailBody(products, email, ordernumber) {
  var acc = "<h1>Order #: " + ordernumber.toString() + "</h1>\
 <h1>" + email + "</h1>\
 <table align='left' style='width:100%' cellspacing='0' cellpadding='10' border='1'>\
 <tr>\
 <th>Product Name</th>\
 <th>Product ID</th>\
 <th>Price</th>\
 <th>SKU</th>\
 <th>Quanity</th>\
 <th>Size</th>\
 <th>Variant</th>\
 <th>Custom Things</th>\
 </tr>"
  for (let i=0; i<products.length; i++) {
    acc += "<tr><td>" + products[i].details.product_name + `</td>
    <td>` + products[i].details.product_id.toString() + `</td>
    <td>` + products[i].details.price.toString() + `</td>
    <td>` + products[i].details.sku + `</td>
    <td>` + products[i].quantity.toString() + `</td>
    <td>` + products[i].size + `</td>
    <td>` + products[i].variant + `</td>`
    '<td>'
    for (let j=0; j<products[i].customization.length; j++) {
      oKeys = Object.keys(products[i].customization[j])
      for (let k=0; k<oKeys.length; k++) {
        acc += '<p>' + oKeys[k].toString() + ': ' + products[i].customization[j][oKeys[k]].toString() + '</p>'
      }
    }
  }

  return acc
}

function createMail(mailBody) {
  const mailOptions = {
    from: creds.email, // sender address
    to: 'gardner.ethan10@gmail.com', // list of receivers
    subject: 'New Order', // Subject line
    html: mailBody.toString()// plain text body
  };

  return mailOptions;
}

module.exports = {
  createMail: createMail,
  createEmailBody,
}
