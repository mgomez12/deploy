import React, { Component } from 'react';
import "../../public/css/styles.css";
import {withRouter} from "react-router-dom";
import NavBar from "../modules/NavBar"
import { Loader } from "semantic-ui-react";

class Main extends Component {
	constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(this.props.userInfo)
    }

    render() {
        if (this.props.userInfo == null) {
            return (<Loader size='massive'/>)
        }
        else {
            if(this.props.userInfo.name == null) {
                this.redirect();
            }

        }
        return(<div>
            <NavBar/>
        </div>)

    }

    redirect() {
        this.props.history.push("/login")
    }
}

export default withRouter(Main);
