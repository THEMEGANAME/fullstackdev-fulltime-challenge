import React, { Component } from "react"
import { Link } from 'react-router-dom'
import { Row, Col as ColAntd, Spin, Icon } from 'antd'
import { Container, Row as RowBootstrap, Button as BtnBootstrap } from 'react-bootstrap'
import styled from 'styled-components'
import ServiceRate from '../components/serviceRate'
import Register from '../components/register'
import { apiService } from '../service/apiService'

const NewContainer = styled(Container)`
margin-top:20px;
`
const NewRow = styled(RowBootstrap)`
margin-top:10px;
`
const Col = styled(ColAntd)`
text-align:center;
`
const Button = styled(BtnBootstrap)`
margin:10px;
`

const Indicator = <Icon type="loading" style={{ fontSize: 60, fontWeight: 'bold' }} spin />

export default class Locker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModal: false,
            locker: [],
            servicePrice: [],
            hidePass: false,
            veriHidePass: false,
            getType: null,
            getId: null,
            isLoading: false
        }
        this.getLocker = this.getLocker.bind(this)
        this.closeLocker = this.closeLocker.bind(this)
        this.hiddenPass = this.hiddenPass.bind(this)
    }
    getLocker(id, type) {
        this.setState({
            getType: type,
            getId: id,
            isModal: true
        });
    }

    closeLocker() {
        this.setState({
            getType: null,
            getId: null,
            isModal: false
        });
        this.API()
    }

    hiddenPass(type) {
        if (type === "hidePass") {
            this.setState({ hidePass: !this.state.hidePass })
        } else {
            this.setState({ veriHidePass: !this.state.veriHidePass })
        }
    }

    async API() {
        this.setState({ isLoading: true })
        const res = await apiService.get('/locker')
        const servicePrice = await apiService.get('/price')

        Promise.all([res, servicePrice])
            .then(res => {
                const lockerData = res[0].data.data
                const priceData = res[1].data.data
                this.setState({
                    locker: lockerData,
                    servicePrice: priceData,
                    isLoading: false
                })
            })
            .catch(err => {
                this.setState({ isLoading: false })

                console.log(err)
            })
    }

    componentWillMount() {
        this.API()
    }

    render() {
        const { locker } = this.state
        return (
            <>
                <Spin spinning={this.state.isLoading} indicator={Indicator} size="large"  >
                    <NewContainer>
                        <NewRow className="justify-content-center">
                            <h2>Coin Locker</h2>
                        </NewRow>
                        <Row type="flex" justify="center" >
                            <Col span={14} >
                                <Row type="flex" justify="center" gutter={10} >
                                    <Col span={8} >
                                        <h4>Small</h4>
                                        {
                                            locker.map((val, index) => {
                                                if (val.size_id === 1)
                                                    if (val.status) {
                                                        return <Link to={`/locker/${val.id}`} key={index}>
                                                            <Button onClick={e => this.getLocker(val.id, "S")} key={index} size="lg" variant="danger" block >Used</Button>
                                                        </Link>
                                                    } else {
                                                        return <Button onClick={e => this.getLocker(val.id, "S")} key={index} size="lg" variant="secondary" block >Available</Button>
                                                    }
                                                return null
                                            })
                                        }
                                    </Col>
                                    <Col span={8} >
                                        <h4>Medium</h4>
                                        {
                                            locker.map((val, index) => {
                                                if (val.size_id === 2)
                                                    if (val.status) {
                                                        return <Link to={`/locker/${val.id}`} key={index}>
                                                            <Button onClick={e => this.getLocker(val.id, "M")} key={index} size="lg" variant="danger" block >Used</Button>
                                                        </Link>
                                                    } else {
                                                        return <Button onClick={e => this.getLocker(val.id, "M")} key={index} size="lg" variant="secondary" block >Available</Button>
                                                    }
                                                return null
                                            })
                                        }
                                    </Col>
                                    <Col span={8} >
                                        <h4>Large</h4>
                                        {
                                            locker.map((val, index) => {
                                                if (val.size_id === 3)
                                                    if (val.status) {
                                                        return <Link to={`/locker/${val.id}`} key={index}>
                                                            <Button onClick={e => this.getLocker(val.id, "L")} key={index} size="lg" variant="danger" block >Used</Button>
                                                        </Link>
                                                    } else {
                                                        return <Button onClick={e => this.getLocker(val.id, "L")} key={index} size="lg" variant="secondary" block >Available</Button>
                                                    }
                                                return null
                                            })
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <NewRow className="justify-content-center">
                            <ServiceRate price={this.state.servicePrice} />
                        </NewRow>
                        <Register
                            {...this.state}
                            getLocker={this.getLocker}
                            closeLocker={this.closeLocker}
                            hiddenPass={this.hiddenPass}
                        />
                    </NewContainer>
                </Spin>
            </>
        )
    }
}
