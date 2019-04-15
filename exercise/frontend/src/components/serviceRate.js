import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export default class ServiceRate extends Component {

    render() {
        return (
            <div>
                <h5>Service Rate</h5>
                <Table>
                    <thead>
                        <tr>
                            <th>Size</th>
                            <th>First 60 minutes</th>
                            <th>Next minutes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>Small</b></td>
                            {
                                this.props.price[0] &&
                                <>
                                    <td >{this.props.price[0].price_1}</td>
                                    <td >{this.props.price[0].price_2}</td>
                                </>
                            }
                        </tr>
                        <tr>
                            <td><b>Medium</b></td>
                            {
                                this.props.price[1] &&
                                <>
                                    <td >{this.props.price[1].price_1}</td>
                                    <td >{this.props.price[1].price_2}</td>
                                </>
                            }
                        </tr>
                        <tr>
                            <td><b>Large</b></td>
                            {
                                this.props.price[2] &&
                                <>
                                    <td >{this.props.price[2].price_1}</td>
                                    <td >{this.props.price[2].price_2}</td>
                                </>
                            }
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }

}