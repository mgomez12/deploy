import React, { Component } from "react";
import "../../public/css/styles.css";
import { Icon, Image, Loader, Card} from "semantic-ui-react";
import { Link} from 'react-router-dom';
import default_profile from "../../public/assets/default_profile.png";
import ListenSimilarites from "../modules/ListenSimilarities"

class DashCard extends Component {
	constructor(props) {
        super(props);

        this.state = {
            friendInfo: null,
            gotFriendInfo: false
        };
        
    }

    componentDidMount() {
        this.getProfile(this.props.cardUserInfo)
        
    }

    getProfile(id) {

        fetch('/api/user?_id=' + id).then(res => res.json())
        .then((profile) => {
            this.setState({
                friendInfo: profile,
                gotFriendInfo: true
            })
        })
    }

    render() {
        if (!this.state.gotFriendInfo) {
            console.log('no friend info')
            return <Loader active size='large'/>
        }
        console.log('got friend info')
        return (
            <Card style={{width:"150px", height:'300px'}}>
                <Image src={this.state.friendInfo.image !== '' ? this.state.friendInfo.image : default_profile}/>
                <Card.Content>
                    <Card.Header> {this.state.friendInfo.name} </Card.Header>
                    <ListenSimilarites cardUserInfo={this.state.friendInfo} viewerInfo={this.props.userInfo}/>
                </Card.Content>
                <Card.Content extra>
                    <a>
                        <Icon name='user' />
                        {this.state.friendInfo.friends.length} Friends
                    </a>
                </Card.Content>
            </Card>
        )
    }
}
export default DashCard;