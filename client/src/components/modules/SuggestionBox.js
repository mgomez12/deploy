import React, { Component } from "react";
import "../../public/css/styles.css";
import { Button, Header, Card, Feed } from "semantic-ui-react";
import { Link} from 'react-router-dom';
import { get } from './api'

class SuggestionBox extends Component {
	constructor(props) {
        super(props);

        this.state = {
            suggestions:[]
        };
    }

    componentDidMount() {
        let sugg;
        get('/api/suggestion', {receiver: this.props.user._id, limit:10}, (suggestionArray) => {
            console.log(suggestionArray)
            sugg = suggestionArray;
        })
        this.setState({
            suggestions: sugg
        })
    }


    render() {
        return (
            <Card>
                <Card.Header>
                    Recent Suggestions
                </Card.Header>
                <Card.Content style={{overflow:'scroll'}}>
                    {}
                </Card.Content>
            </Card>
        )
    }
}
export default SuggestionBox;