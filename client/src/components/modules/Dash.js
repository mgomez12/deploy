import React, { Component } from "react";
import "../../public/css/styles.css";
import { Segment, Loader, Button, Header, Card } from "semantic-ui-react";
import { Link} from 'react-router-dom';
import DashCard from "../modules/DashCard"

class Dash extends Component {
	constructor(props) {
        super(props);

        this.state = {
            friends: {
                friends: []
            }
        };
        this.gotDashInfo = false;
    }

    componentDidMount() {
        fetch('/api/friend?_id=' + this.props.userId, {method: "GET"})
        .then(res => res.json())
        .then( friendObj => {
            console.log(friendObj)
            this.setState({
                friends: friendObj
            })
        })
        
    }

    loadCards() {
        return this.state.friends.friends.map( friend => 
            <DashCard key = {friend} userInfo={this.props.userInfo} cardUserInfo={friend}/>)
    }

    render() {
        return (
            <div>
                {this.props.friendCount == 0 ? <Header as='h3' style={{color:'gray'}}>You currently don't have any friends. Follow friends to see their cards!</Header>:
                <Card.Group itemsPerRow="4">
                    {this.loadCards()}
                </Card.Group>}
            </div>
        )
    }
}
export default Dash;