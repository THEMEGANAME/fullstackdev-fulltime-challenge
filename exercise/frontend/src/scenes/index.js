import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Locker from "../locker/locker"
import LockerVerify from '../locker/lockerVerify'

class Scenes extends Component {
    render() {
        return (
            <Router>
                <Route exact path="/" component={Locker} />
                <Route exact path="/locker/:id" component={LockerVerify} />
            </Router>
        )
    }
}

export default Scenes