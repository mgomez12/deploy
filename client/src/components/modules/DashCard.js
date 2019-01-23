import React, { Component } from "react";
import "../../public/css/styles.css";
import { Dimmer, Loader, Icon, Image, Button, Card, Header } from "semantic-ui-react";
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
        this.getFriendInfo(this.props.friendId);
    }

    getFriendInfo(id) {
        fetch('/api/user?_id=' + id).then(res => res.json())
        .then((profile) => {
            this.setState({
                friendInfo: profile,
            })
            this.gotFriendInfo = true;
            this.render();
        })
    }

    render() {
        console.log(this.gotFriendInfo)
        let image, name = "";
        let length = 0;
        if(this.gotFriendInfo) {
            console.log("bro")
            image = this.state.friendInfo.image;
            name = this.state.friendInfo.name;
            length = this.state.friendInfo.friends.length;
        }
        return (
            <Card>
                <Image src={image}/>
                <Card.Content>
                    <Card.Header> {name} </Card.Header>
                    
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <Icon name='user' />
                        {length} Friends
                    </a>
                </Card.Content>
            </Card>
        )
    }
}
export default DashCard;