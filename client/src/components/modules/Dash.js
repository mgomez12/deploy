import React, { Component } from "react";
import "../../public/css/styles.css";
import { Segment, Loader, Button, Header, Card } from "semantic-ui-react";
import { Link} from 'react-router-dom';
import DashCard from "../modules/DashCard"

class Dash extends Component {
	constructor(props) {
        super(props);

        this.state = {
            results: this.props.userInfo.friends
        };
        this.gotDashInfo = false;
    }

    componentDidMount() {
        
    }

    loadCards() {
        return(
            this.state.results.map( friend => {
            return(
                <DashCard friendId={friend}/>
            );
        })
        );
    }

    render() {
        return (
            <div>
                <Card.Group>
                    {this.loadCards()}
                </Card.Group>
            </div>
        )
    }
}
export default Dash;