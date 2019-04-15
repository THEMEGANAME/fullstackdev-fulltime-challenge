require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const moment = require('moment')
const bcrypt = require('bcrypt')

const connection = require('./database');


const app = express();
app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const salt = 10

//test fn
app.get('/', function (req, res) {
    res.status(200).send('Test name')
})

//Locker Module
app.get('/locker', function (req, res) {
    try {
        connection.query('SELECT id,size_id,status from locker', function (err, rows, fields) {
            if (err) throw err
            res.status(200).send({ "data": rows })
        })
    } catch (error) {
        console.log('error:', error)
        res.status(500).send({ "error": 'Something went wrong' })
    }
})

app.get('/locker/:id', function (req, res) {
    try {
        connection.query('SELECT id,size_id,status from locker WHERE id=?', parseInt(req.params.id), function (err, rows, fields) {
            if (err) throw err
            const data = rows[0]
            res.status(200).send({ "data": data })
        })
    } catch (error) {
        console.log('error:', error)
        res.status(500).send({ "error": 'Something went wrong' })
    }
})

app.post('/locker/:id/verify', function (req, res) {
    try {
        const { phone, password } = req.body

        const verifyPin = new Promise((resolve, eject) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) eject()
                resolve(hash)
            });
        })
        Promise.all([verifyPin])
            .then(response => {
                connection.query('SELECT * from locker join service_charge on service_charge.size_id = locker.size_id WHERE locker.id=? ', parseInt(req.params.id), function (err, rows, fields) {
                    if (err) throw err
                    const json = JSON.parse(JSON.stringify(...rows))
                    if (phone.toString() != json.phone.toString()) {
                        res.status(500).send({ "error": 'Invalid Phone Number or Password' })
                    }
                    //check pin
                    const comparePin = new Promise((resolve, eject) => {
                        bcrypt.compare(password, json.pin.toString(), function (err, res) {
                            if (err) eject(false)
                            resolve(res)
                        });
                    })
                    Promise.all([comparePin])
                        .then(resComparePin => {
                            if (resComparePin[0]) {
                                let amount
                                const duration = moment().diff(moment(json.create_at), 's')
                                if (duration > 3600) {
                                    amount = (json.price_2 * Math.ceil((duration - 3600) / 3600)) + json.price_1
                                } else {
                                    amount = json.price_1
                                }

                                connection.query('UPDATE locker SET  amount=? WHERE id= ?', [amount, parseInt(req.params.id)], function (err, rows, fields) {
                                    if (err) throw err
                                    res.status(200).send({
                                        data: {
                                            isVerify: true,
                                            amount: amount
                                        }
                                    })
                                })

                            } else {
                                res.status(500).send({ "error": 'Invalid Phone Number or Password', isVerify: false })
                            }
                        })
                        .catch(errComparePin => {
                            console.log('errComparePin:', errComparePin)
                        })
                })
            })
            .catch(err => {
                console.log(err)
            })
    } catch (error) {
        console.log('error:', error)
        res.status(500).send({ "error": 'Something went wrong' })
    }
})

//new register user use locker
app.post('/register', async (req, res) => {

    try {
        const { id, phone, password } = req.body

        const getEncryp = new Promise((resolve, eject) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) eject()
                resolve(hash)
            });
        })
        Promise.all([getEncryp])
            .then(pin => {
                connection.query('UPDATE locker SET `status`=1 , `phone`=? , `pin`=?, create_at=? WHERE id= ?', [phone, pin, moment().format("YYYY-MM-DD HH:mm:ss"), parseInt(id)], function (err, rows, fields) {
                    if (err) throw err
                    res.status(200).send('Register Success')
                })

            })

    } catch (error) {
        console.log('error:', error)
        res.status(500).send({ "error": 'Something went wrong' })
    }
})


//user get item back
app.get('/price', function (req, res) {
    try {
        connection.query('SELECT size_id,price_1,price_2 from service_charge', function (err, rows, fields) {
            if (err) throw err
            res.status(200).send({ "data": rows })
        })
    } catch (error) {
        console.log('error:', error)
        res.status(500).send({ "error": 'Something went wrong' })
    }
})

app.post('/payment', function (req, res) {
    const { id, amount, password } = req.body
    connection.query('SELECT * from locker  WHERE id=? ', parseInt(id), function (err, rows, fields) {
        if (err) throw err
        const data = JSON.parse(JSON.stringify(...rows))

        if (amount < data.amount) {
            res.status(500).send({ "error": 'Invalid Amount' })
            return
        }
        const comparePin = new Promise((resolve, eject) => {
            bcrypt.compare(password, data.pin.toString(), function (err, res) {
                if (err) eject(false)
                resolve(res)
            });
        })
        Promise.all([comparePin])
            .then(resComparePin => {
                if (resComparePin[0]) {

                    connection.query('UPDATE locker SET  status=0,phone=NULL,pin=NULL,create_at=NULL,amount=NULL WHERE id= ?', parseInt(id), function (err, rows, fields) {
                        if (err) throw err
                        res.status(200).send({
                            data: {
                                isPayment: true,
                                coinChange: amount - data.amount
                            }
                        })
                    })

                } else {
                    res.status(500).send({ "error": 'Invalid Password', isVerify: false })
                }
            })
            .catch(errComparePin => {
                console.log('errComparePin:', errComparePin)
            })

    })
})

app.listen(8080, function () {
    console.log('listening on 8080 : http://localhost:8080')
})