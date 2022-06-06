import { Application, Request, Response } from "express";
import paypal from "paypal-rest-sdk"
import { config } from "../config";

paypal.configure({
    'mode': 'sandbox',
    'client_id': config.paypalClientId,
    'client_secret': config.paypalClientSecret
});

const pay_with_paypal = (app: Application, total: number): void => {
    app.post("/pay_with_paypal", (_req: Request, res: Response): void => {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:8080/success",
                "cancel_url": "http://localhost:8080/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Iphone 13 Pro Max",
                        "sku": "001",
                        "price": "25.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                },
                "description": "This is the payment description."
            }]
        };

        paypal.payment.create(create_payment_json, (error, payment): void => {
            if (error) {
                throw error;
            } else if (payment.links !== undefined) {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                        res.redirect(payment.links[i].href)
                    }
                }
            }
        });
    })
    
    app.get("/success", (req: Request, res: Response): void => {
        const payerId = <string>req.query.payerId;
        const paymentId = <string>req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": `${ total }`
                }
            }]
        }

        paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
            if (error) {
                console.log(error.response)
                throw error
            } else {
                console.log("Get Payment Response")
                res.json(payment)
                res.json("Success")
            }
        })
    })

    app.get("/cancel", (_req: Request, res: Response): void => {
        res.json("Cancelled")
    })
}

e