const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY)

const renderBuyPage = async (req, res) => {

    try {

        res.render('buy', {
            key: STRIPE_PUBLISHABLE_KEY,
            amount: 25
        })

    } catch (error) {
        console.log(error.message);
    }

}

const payment = async (req, res) => {

    try {

        const customer = await stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: 'Sumit',
            address: {
                line1: '115, Vikas Nagar',
                postal_code: '3800061',
                city: 'ahamdabad',
                state: 'Gujurat',
                country: 'India',
            }
        })
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            description: req.body.productName,
            currency: "INR",
            customer: customer.id,
            // automatic_payment_methods: {
            //     enabled: true,
            // },
            payment_method_types: ['card'],
            payment_method: customer.default_source,
        });
        if (paymentIntent.status === 'requires_confirmation') {
            const result = stripe.confirmPayment(paymentIntent.client_secret, {
                payment_method: customer.default_source
            })

            if (result?.error) {
                console.log('1')
                // Handle any error during customer action
                console.error(result.error);
            } else {
                console.log('2')
                res.redirect("/success")

                // Payment completed successfully
                console.log('Payment successful:', result?.paymentIntent);
            }

        } else if (res.message === 'Success') {
            console.log('3')
            // Handle success without customer action
            console.log('Payment successful:', res.data);
            res.redirect("/success")
        } else {
            res.redirect("/failure")
        };
    } catch (error) {
        console.log(error.message);
    }

}

const success = async (req, res) => {

    try {

        res.render('success');

    } catch (error) {
        console.log(error.message);
    }

}

const failure = async (req, res) => {

    try {

        res.render('failure');

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    renderBuyPage,
    payment,
    success,
    failure
}

