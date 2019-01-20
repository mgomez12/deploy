import React, { Component } from 'react';
import "../../public/css/styles.css";
import {withRouter} from "react-router-dom";
import NavBar from "../modules/NavBar"
import { Loader } from "semantic-ui-react";

class Main extends Component {
	constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        if (this.props.UserInfo !== null && !this.props.userInfo.name) {
            console.log('main redirected');
            this.props.history.push("/login");
        }
    }

    render() {
        if (!this.props.userInfo) {
            return <Loader size='massive'/>
        }
        return(<div>
            <NavBar/>
        </div>)

    }
}

export default withRouter(Main);
