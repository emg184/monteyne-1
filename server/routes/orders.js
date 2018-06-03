const keys = require('../config.js');
const stripe = require('stripe')(keys.stripePrivateKey);
const queries = require('../queries/orders');

const nodemailer = require('nodemailer');
const creds = require('../config');
const funcs = require('../queries/mailer')

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: creds.email,
        pass: creds.ULTRASECRETPASS
    }
});



const sendErr = function(res, msg, code) {
    res.send(code).json({ error: msg });
}

const makeStripeOrder = function(options, cb) {
    stripe.customers.create({
        email: options.email,
        card: options.card
    }).then(function(customer) {
        return stripe.charges.create({
            amount: options.totalPrice,
            receipt_email: options.email,
            description: "Charge for order of " + options.qty + " " + options.type,
            currency: "usd",
            customer: customer.id
        });
    }).then(function(charge) {
        cb(charge);
    }).catch(err => {
        console.log("Stripe Error:", err);
        sendErr(options.res, 500, err.Error);
    });
}
module.exports = app => {
  app.post("/api/order", (req,res) => {
    let options = {};
    options.email = req.body.stripe.email;
    options.card = req.body.stripe.id;
    options.totalPrice = req.body.cart.totalPrice * 100;
    options.res = res;
    makeStripeOrder(options, function(charge) {
        let saveData = queries.cartDestructure(req.body.cart.products)
        queries.newOrder(JSON.stringify(saveData), JSON.stringify(req.body.shipping_info), req.body.stripe.email, req.body.name, req.body.totalPrice)
        .then( result => {
          var mailOps = funcs.createMail()
          transporter.sendMail(mailOps, function (err, info) {
                 if(err)
                   console.log(err)
                 else
                   console.log(info);
          })
          res.status(200).json({ "charge": charge, "orderId": result })
        })
    });
  })
  app.get("/api/order", (req,res) => {
    queries.getOrders()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
  })
}
