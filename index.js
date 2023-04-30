const express = require('express');
const MercadoPago = require('mercadopago');
const app = express();
const secret = require('./secret_mercado_pago');

MercadoPago.configure({
    sandbox: true,
    access_token: secret
});

app.get('/', (req, res) => {
    res.send("Olá mundo");
});

app.get('/payment', async (req, res) => {

    const id = Date.now().toString();
    const emailPayer = 'qualqueremail@email.com';

    const data = {
        items: [
            item = {
                id: id,
                title: 'qualquer descricao',
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer: {
            email: emailPayer,
        },
        external_reference: id,
    }

    try {
        const payment = await MercadoPago.preferences.create(data);
        console.log(payment);
        //Banco.SalvarPagamento({ id: id, pagador: emailPayer });
        return res.redirect(payment.body.init_point);
    } catch (error) {
        return res.send(error.message);
    }

});

app.post('/notification', (req, res) => {
    console.log(req.query);

    setTimeout(() => {
        const filter = {
            'order.id': req.query.id
        };

        MercadoPago.payment.search({
            qs: filter
        }).then(data => {
            const payment = data.body.results[0];
            if (payment) {
                console.log(payment);
                console.log(payment.external_reference);
                console.log(payment.status);
            } else {
                console.log("Pagamento não existe");
            }
        }).catch(err => {
            console.log(err);
        });

    }, 20000);
    res.send('OK');
})

app.listen(3000, (req, res) => {
    console.log("Rodando");
});