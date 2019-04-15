import React, { Component } from "react"
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Spin, Icon, Row, Col } from 'antd'
import { Button, Form, InputGroup } from 'react-bootstrap';
import { apiService } from '../service/apiService'

const { Control } = Form

const ErrorMessage = styled.h4`
color:red;
`
const ButtonTHB = styled(Button)`

`
const Indicator = <Icon type="loading" style={{ fontSize: 60, fontWeight: 'bold' }} spin />
const coinList = [1, 2, 5, 10]
const Banknote = [20, 50, 100, 500, 1000]
const list = [1, 2, 5, 10, 20, 50, 100, 500, 1000].reverse()

export default class Payment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            coin: 0,
            coinChange: null,
            isPayment: false,
            listCoin: []
        }
        this.addCoin = this.addCoin.bind(this)
        this.submit = this.submit.bind(this)
    }

    addCoin(amount) {
        this.setState({
            coin: this.state.coin + amount
        })
    }
    computeChange(changeArray, amount) {
        const result = [];
        for (let i = 0; i < changeArray.length; i++) {
            let changeAmount = Math.floor(amount / changeArray[i]);
            amount -= (changeArray[i] * changeAmount);
            result.push(changeAmount);
        }
        return result;
    }
    submit() {
        const data = {
            password: this.props.password,
            amount: this.state.coin,
            id: this.props.match.params.id
        }

        apiService.post('/payment', data)
            .then(res => {
                const { data } = res.data


                const count = this.computeChange(list, data.coinChange)
                const tmp = []
                count.map((val, index) => {
                    tmp.push({
                        coin: list[index],
                        count: val
                    })
                })

                this.setState({
                    coinChange: data.coinChange,
                    isPayment: true,
                    listCoin: tmp
                })

            })
            .catch(err => {
                console.log(err.respo)
            })


    }

    render() {
        const { isLoading, coin, isPayment, listCoin, coinChange } = this.state
        console.log(this.state)
        const { amount } = this.props
        const enough = (amount - coin) >= 0

        return (
            <Spin spinning={isLoading} indicator={Indicator} size="large" >

                <br />
                {
                    isPayment ?
                        <>
                            <Row type="flex" justify='center'>
                                <h5>Coin Change : {coinChange} THB</h5>
                            </Row>
                            <Row type="flex" justify='center'>
                                <Col span={14}>
                                    <Row type="flex" justify='center' gutter={10} style={{ marginTop: 5 }} >
                                        <table>
                                            <tr>
                                                <th>Coin</th>
                                                <th>Amount</th>
                                            </tr>
                                            {
                                                listCoin.map((val, index) => {
                                                    return <tr key={index}>
                                                        <td>{val.coin}</td>
                                                        <td align='center'>{val.count}</td>
                                                    </tr>
                                                })
                                            }

                                        </table>

                                    </Row>
                                </Col>
                            </Row>
                            <br />
                            <Row type="flex" justify='center'>
                                <Col span={12}>
                                    <Row type="flex" justify='center' gutter={10} style={{ marginTop: 5 }} >
                                        <Col span={14}><Link to='/'><Button variant='secondary' block >Back</Button></Link></Col>
                                    </Row>
                                </Col>
                            </Row>

                        </>
                        :
                        <>
                            <Row type="flex" justify='center'>
                                <h5>Payment</h5>
                            </Row>
                            <Row type="flex" justify='center'>
                                <Col span={12}>
                                    <Row type="flex" justify='center' gutter={10}>
                                        <Col span={14}>
                                            <Control value={`${amount} THB`} disabled />
                                        </Col>
                                    </Row>

                                    <br />
                                </Col>
                            </Row>
                            <Row type="flex" justify='center'>
                                <h5>Coin Insert : {coin}</h5>
                            </Row>
                            <br />
                            <Row type="flex" justify='center'>
                                <Col span={18}>
                                    <Row type="flex" justify='center' gutter={10}>
                                        {
                                            coinList.map((val, index) => {
                                                return <Col span={4} key={index}>
                                                    <ButtonTHB variant='dark' onClick={e => this.addCoin(val)} >{val} THB</ButtonTHB>
                                                </Col>
                                            })
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <br />
                            <Row type="flex" justify='center'>
                                <Col span={18}>
                                    <Row type="flex" justify='center' gutter={2}>
                                        {
                                            Banknote.map((val, index) => {
                                                return <Col span={4} key={index}>
                                                    <ButtonTHB variant='dark' onClick={e => this.addCoin(val)} >{val} THB</ButtonTHB>
                                                </Col>
                                            })
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <br />
                            <Row type="flex" justify='center'>
                                {
                                    enough && <ErrorMessage>Coin is not enough</ErrorMessage>
                                }
                            </Row>
                            <br />
                            <Row type="flex" justify='center'>
                                <Col span={12}>
                                    <Row type="flex" justify='center' gutter={10}>
                                        {

                                        }
                                        <Col span={14}><Button block onClick={this.submit} disabled={enough}>Payment</Button></Col>
                                    </Row>
                                    <Row type="flex" justify='center' gutter={10} style={{ marginTop: 5 }} >
                                        <Col span={14}><Link to='/'><Button variant='secondary' block >Back</Button></Link></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                }

            </Spin>
        )
    }
}