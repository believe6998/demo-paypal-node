const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');

router.get('/', function (req, res) {
    res.render('client/deposit', {'user': req.user});
});

let total = 0;
router.post('/pay', function (req, res) {
    let items = req.body.data;
    for (const item of items) {
        total += parseFloat(item.price) * item.quantity
    }
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": items
            },
            "amount": {
                "currency": "USD",
                "total": total.toString()
            }
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error);
            res.send(error)
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                    res.send(payment.links[i].href);
                }
            }
        }
    });
});

router.get('/success', (req, res) => {
    console.log(req.query)
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        payer_id: payerId,
        transactions: [
            {
                amount:
                    {
                        total: total.toString(),
                        currency: 'USD'
                    }
            }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            res.send(error)
        } else {
            const data = {
                payerId: payerId,
                ...execute_payment_json,
                message: 'Ta sẽ cập nhật lại trạng thái đơn hàng, hoặc làm gì đó ở api trả về khi thanh toán thành công này'
            }
            res.send(data)
        }
    });
});

router.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = router;
