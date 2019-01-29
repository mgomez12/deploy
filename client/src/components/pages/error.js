import React, { Component } from "react";
import "../../public/css/styles.css";
import { Link} from 'react-router-dom';
import {Image, Header, Button} from 'semantic-ui-react';
import confused_llama from "../../public/assets/confused_llama.png";


class ErrorPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div>
        <div className="center-screen" id="center-text">
            <Header size="huge">
                <p>Error: Page Not Found</p>
                <Image size='massive' src={confused_llama}/>
            </Header>
            <Button size='mini' href='/'>Back to Home</Button>
        </div>
        </div>
        )
    }
}
export default ErrorPage;