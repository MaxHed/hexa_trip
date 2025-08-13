const { StatusCodes } = require('http-status-codes');
const { hotelTax } = require('../helpers/data');
const Trip = require('../models/Trip');
const Order = require('../models/Order');
const Stripe = require('stripe');

const createStripeSession = async (req, res) => {
    try {
        // init stripe session
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
       
        // Import everything sent by the client 
        const { order, items, token } = req.body;

        //  Fetch trip sold in the transaction from the database (items is an array of one only item : items[0] wich is the trip ) :
        const Trip = await Trip.findById(items[0].id);

        // Do the transaction/payment via stripe :
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: items.map(item => {
                return {
                    price_data: {
                    currency: 'eur',
                    product_data: {
                        name: Trip.title,
                    },
                    unit_amount: Trip.adultPrice * item[0].adults + Trip.youngPrice * item[0].kids + hotelTax,
                },
                quantity: item.quantity,
            }
        }),
            success_url: `${process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_LOCAL}/checkout-success`,
            cancel_url: `${process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_LOCAL}/checkout-cancel`,
        });

        // Normally, the order should be placed into the db after proof of stripe payement successfull
        // How to do it vie webhook here: https://docs.stripe.com/checkout/fullfillement#create-event-handler

        // Write the purchase Order in the database (in mode "not logged/visitor" and in mode logged user)
        if(!token.token) {
            await Order.create({...order, email: "guest@guest.com"});
        } else {
            await Order.create(order);
        }

        // Exit
        return res.status(StatusCodes.OK).json({ url: session.url });
        
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error while creating stripe session, message: ' + error.message });
    }
}

module.exports = { createStripeSession };