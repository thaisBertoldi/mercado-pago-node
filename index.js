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

app.listen(3000, (req, res) => {
    console.log("Rodando");
});