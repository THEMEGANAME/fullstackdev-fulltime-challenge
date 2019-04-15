import React, { Component } from "react";
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { apiService } from '../service/apiService'
import { Row, Col, Spin, Icon } from 'antd'
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import styled from 'styled-components'
import Payment from "../components/payment";
const { Group, Label, Control, } = Form
const { Prepend } = InputGroup

const Error = styled.div`
color:red
`

const Indicator = <Icon type="loading" style={{ fontSize: 60, fontWeight: 'bold' }} spin />

class LockerVerify extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRedirect: false,
            isLoading: false,
            phone: '',
            password: '',
            hidden: false,
            error: null,
            amount: null,
            isVerify: false
        }
        this.verify = this.verify.bind(this)
        this.setData = this.setData.bind(this)
        this.setHidden = this.setHidden.bind(this)
    }
    componentWillMount() {
        const { id } = this.props.match.params

        const res = apiService.get(`/locker/${id}`)
        res.then(res => {
            const { data } = res.data
            if (!data.status) {
                this.setState({ isRedirect: true })
                return
            }
        })
            .catch(err => {
                console.log(err)
            })
    }
    setData(e, type) {
        this.setState({ [type]: e.target.value, error: false })
    }
    setHidden() {
        this.setState({ hidden: !this.state.hidden })
    }
    verify() {
        this.setState({ isLoading: true })
        const { id } = this.props.match.params
        const { phone, password } = this.state
        const data = {
            phone: phone,
            password: password
        }
        apiService.post(`locker/${id}/verify`, data)
            .then(res => {
                console.log('res:', res)
                const { data } = res.data
                this.setState({
                    amount: data.amount,
                    isVerify: true,
                    isLoading: false
                })
            })
            .catch(err => {
                const { error } = err.response.data
                this.setState({
                    error: error,
                    isLoading: false
                })
            })

    }
    render() {
        const { isLoading, isRedirect, phone, password, hidden, error, isVerify } = this.state

        return (
            <Spin spinning={isLoading} indicator={Indicator} size="large">
                {isRedirect && <Redirect to='/' />}
                <Row type="flex" justify='center'>
                    <h2>Coin Locker</h2>
                </Row>

                {
                    !isVerify ?
                        <>
                            <Row type="flex" justify='center'>
                                <h5>Unlock</h5>
                            </Row>
                            <Row type="flex" justify='center'>
                                <Col span={12}>
                                    <Row type="flex" justify='center' gutter={10}>
                                        <Col span={14}>Phone :<Control value={phone} onChange={e => this.setData(e, 'phone')} maxLength={10} /></Col>
                                    </Row>
                                    <Row type="flex" justify='center' gutter={10}>
                                        <Col span={14}>Password (4-digi):
                                    <InputGroup className="mb-3">
                                                <Control type={hidden ? 'text' : 'password'} value={password} onChange={e => this.setData(e, 'password')} maxLength={4} />
                                                <Prepend>
                                                    <Button variant="outline-secondary" onClick={this.setHidden}>Show</Button>
                                                </Prepend>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                    <Row type="flex" justify='center' gutter={10}>
                                        <Error>
                                            {error && error}
                                        </Error>
                                    </Row>
                                    <br />
                                    <Row type="flex" justify='center' gutter={10}>
                                        <Col span={14}><Button block onClick={this.verify}>Verify</Button></Col>
                                    </Row>
                                    <Row type="flex" justify='center' gutter={10} style={{ marginTop: 10 }}>
                                        <Col span={14}><Link to='/'><Button variant='secondary' block >Back</Button></Link></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                        :
                        <Payment {...this.state} {...this.props} />

                }


            </Spin>
        )
    }
}
export default LockerVerify