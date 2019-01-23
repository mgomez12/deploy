import React, { Component } from "react";
import "../../public/css/styles.css";
import { Link} from 'react-router-dom';

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
            </Header>
            <Button size='mini' href='/Main'>Back to Home</Button>
        </div>
        </div>
        )
    }
}
export default ErrorPage;