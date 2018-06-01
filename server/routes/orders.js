const keys = require('../config.js');
const stripe = require('stripe')(keys.stripePrivateKey);


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
        cb();
        options.res.send(charge);
    }).catch(err => {
        console.log("Stripe Error:", err);
        sendErr(options.res, 500, err.Error);
    });
}

app.post("/api/charge", (req, res) => {
    let options = {};
    //options.type = req.body.cart.type;
    //options.qty = req.body.form.amount;
    options.email = req.body.stripe.email;
    options.card = req.body.stripe.id;
    options.totalPrice = req.body.cart.totalPrice * 100;
    options.res = res;

    makeStripeOrder(options, function() {
        //callback if you need
    });
});
