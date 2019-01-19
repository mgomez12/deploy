import React, { Component } from 'react';
import "../../public/css/styles.css";
import {withRouter} from "react-router-dom";

class Main extends Component {
	constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        console.log(this.props.userInfo)
        if (this.props.userInfo == null) {
            this.props.history.push("/login")
        }
    }

    render() {
        console.log(this.props.userInfo)
        return(<div></div>)

    }
}

export default withRouter(Main);
