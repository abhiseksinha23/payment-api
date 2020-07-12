const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_C2PTrKHpONvCrYTGFkBpAvB000Gc8oS54q");
const uuid = require("uuid/v4");

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
    res.send("it is working");
});

app.post("/payment", (req, res) => {
    const { product, token } = req.body;
    console.log("Product ", product);
    console.log("price ", product.price);
    const idempontencykey = uuid();

    return stripe.customers.create({
            email: token.email,
            source: token.id
        }).then(customer => {
            stripe.charges.create({
                amount: product.price * 100,
                currency: 'usd',
                customer: customer.id,
                receipt_email: token.email,
                description: `purchase of ${product.name}`,
                shipping: {
                    name: token.card.name,
                    address: {
                        country: token.card.address_country
                    }
                }
            }, { idempontencykey })
        })
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err))
});

//listen
app.listen(3000, () => {
    console.log("server started!!");
});