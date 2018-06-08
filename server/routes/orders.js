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
        switch (err.type) {
          case 'StripeCardError':
            // A declined card error
            err.message; // => e.g. "Your card's expiration year is invalid."
            res.status(400).json(message: JSON.stringify(err.message));
            break;
          case 'StripeInvalidRequestError':
            // Invalid parameters were supplied to Stripe's API
            res.status(400).json(message: "Invalid parameters were supplied to Stripe's API");
            break;
          case 'StripeAPIError':
            // An error occurred internally with Stripe's API
            res.status(400).json(message: "An error occurred internally with Stripe's API");
            break;
          case 'StripeConnectionError':
            // Some kind of error occurred during the HTTPS communication
            res.status(400).json(message: "An error occurred involving secure communication");
            break;
          case 'StripeAuthenticationError':
            // You probably used an incorrect API key
            res.status(400).json(message: "The site is currently incapable of servicing requests");
            break;
          case 'StripeRateLimitError':
            // Too many requests hit the API too quickly
            res.status(400).json(message: "The site is currently under high load please try again soon");
            break;
        }
         //return options.res.status(500).json(err.Error)
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
          var mailBody = funcs.createEmailBody(newData, req.body.stripe.email, result[0].toString())
          var mailOps = funcs.createMail(mailBody)
          transporter.sendMail(mailOps, function (err, info) {
                 if(err) {

                 }
                 else {

                 }
          })
          res.status(200).json({ "charge": charge, "orderId": result })
        })
    });
  })
  app.get("/api/order", (req,res) => {
    queries.getOrders()
      .then(result => {
        res.status(200).json(result);
      })
  })
}
