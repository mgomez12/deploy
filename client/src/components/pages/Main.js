import React, { Component } from 'react';
import "../../public/css/styles.css";
import {withRouter} from "react-router-dom";
import NavBar from "../modules/NavBar"

class Main extends Component {
	constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(this.props.userInfo)
        if (this.props.userInfo.name == null) {
            console.log('main redirected')
            this.props.history.push("/login")
        }
    }

    render() {
        
        return(<div>
            <NavBar/>
        </div>)

    }
}

export default withRouter(Main);
