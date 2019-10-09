const admin = require('firebase-admin');
const functions = require('firebase-functions');
const keyStripe = functions.config().stripekey.keysandbox;
const stripe = require('stripe')(keyStripe)
const cors = require('cors')({
    origin: true,
  })

const proccessPayment = (req, res) => {
    res.header('Content-Type','application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const token = req.body.token
    const emailCustomer = req.body.emailCustomer
    const total = (req.body.totalAmount)
    const fee = ((total *2.9)/100) +0.30
    const totalAmount = parseFloat(total + fee).toFixed(2)
    const accessToken = req.header('Authorization')
    const tokenAccess = accessToken.split(' ')
    admin.auth().verifyIdToken(tokenAccess[1])
      .then(async (decodedToken) => {
        //   console.log(' decoddee ', decodedToken)
          if( decodedToken.email === emailCustomer) {
            return cors(req, res, () => {
                stripe.customers
                .create({
                    email: emailCustomer,
                })
                .then((customer) => {
                    console.log('CUSTOMERR RES ', customer)
                    return stripe.customers.createSource(customer.id, {
                    source: token,
                    });
                })
                .then((source) => {
                    console.log("SOURCEEE stripe res ",source)
                    return stripe.charges.create({
                    amount: totalAmount * 100,
                    currency: 'usd',
                    customer: source.customer,
                    });
                })
                .then((charge) => {
                    // New charge created on a new customer
                    console.log('Chargeeee ',charge)
                    return res.send({
                        success: true,
                        charge
                    })
                })
                .catch((err) => {
                    // Deal with an error
                    console.log('ERRROOOOOOORRR ', err)
                    return res.send({
                        success: false,
                        err
                    })
                });      
            })
          } else {
            return res.send({
                success: false,
                err: 'Access token err'
            })
          }
      }).catch( err => {
          console.log(' error acceess ',err)
          return res.send({
            success: false,
            err
        })   
      })
  }

module.exports = {proccessPayment};