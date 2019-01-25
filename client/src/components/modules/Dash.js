import React, { Component } from "react";
import "../../public/css/styles.css";
import { Segment, Loader, Button, Header, Card } from "semantic-ui-react";
import { Link} from 'react-router-dom';
import DashCard from "../modules/DashCard"

class Dash extends Component {
	constructor(props) {
        super(props);

        this.state = {
        };
        this.gotDashInfo = false;
    }

    componentDidMount() {
        
    }

    loadCards() {
        console.log(this.props.userInfo.friends)
            return(
                this.props.userInfo.friends.map( friend => <DashCard key = {friend} userInfo={this.props.userInfo} cardUserInfo={friend}/>)
            );
    }

    render() {
        return (
            <div>
                <Card.Group itemsPerRow="4">
                    {this.loadCards()}
                </Card.Group>
            </div>
        )
    }
}
export default Dash;