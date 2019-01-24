import React, { Component } from 'react';
import "../../public/css/styles.css"
import io from 'socket.io-client';
import { Message, Button } from 'semantic-ui-react';
import { post, get } from "./api"

class FriendForm extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');

        this.state = {
            added: false
        };

        this.addFriend = this.addFriend.bind(this)

    }
    componentDidMount() {
        this.areFriends();
        console.log(this.props.viewerInfo.friends)

    }
    componentDidUpdate() {
        this.areFriends();
    }
    
    areFriends() {
        if(this.props.viewerInfo.friends.includes(this.props.recieverId)) {
            console.log("are friends")
            this.setState({
                added: true
            })
        }
          console.log(this.props.viewerInfo.friends)
    }

    addFriend() {
        this.setState({
            added: true
        })
        post('/api/friend', {receiver: this.props.receiverId, sender: this.props.userId})
        get('/api/updateUser', {}, response => {console.log(response)});
    }
    render() {
        return(
        <div style={{display:'inline-block'}}>

            {this.state.added ? <Message compact positive><Message.Header>Friend Added!</Message.Header></Message> :
            <Button
                color='teal'
                content='Follow'
                onClick={this.addFriend}
            />}
        </div>
        )
    }
}
export default FriendForm;