import React, { Component } from "react";
import "../../public/css/styles.css";
import { Icon, Image, Button, Card, Header } from "semantic-ui-react";
import { Link} from 'react-router-dom';

class DashCard extends Component {
	constructor(props) {
        super(props);

        this.state = {
            friendInfo: null
        };
        this.gotFriendInfo = false;
        
    }

    componentDidMount() {
        
    }

    getProfile(id) {

        fetch('/api/user?_id=' + id).then(res => res.json())
        .then((profile) => {
            this.setState({
                friendInfo: profile,
                isRedirecting: false
            })
            this.gotFriendInfo = true;
        })
    }

    render() {
        return (
            <Card>
                <Image src={this.props.userInfo.image}/>
                <Card.Content>
                    <Card.Header> {this.props.userInfo.name} </Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <Icon name='user' />
                        {this.props.userInfo.friends.length} Friends
                    </a>
                </Card.Content>
            </Card>
        )
    }
}
export default DashCard;