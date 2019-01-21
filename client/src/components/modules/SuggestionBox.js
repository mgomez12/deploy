import React, { Component } from "react";
import "../../public/css/styles.css";
import { Button, Header } from "semantic-ui-react";
import { Link} from 'react-router-dom';

class SuggestionBox extends Component {
	constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <Card header="Recent suggestions">
                <Card.item></Card.item>
            </Card>
        )
    }
}
export default SuggestionBox;