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

    loadListenSimilarities() {
        return <div><ListenSimilarites cardUserInfo={this.state.friendInfo} viewerInfo={this.props.userInfo}/></div>;

    }

    loadExtra() {
        return this.state.friendInfo.friends + " Friends"                   
    }

    render() {
        if (!this.state.gotFriendInfo) {
            console.log('no friend info')
            return <Loader active size='large'/>
        }
        console.log('got friend info')
        var href = "/u/profile/" + this.state.friendInfo._id;
        return (
            <div>
                <Card
                    link
                    color="teal"
                    raised>
                        <Image 
                            src={this.state.friendInfo.image !== '' ? this.state.friendInfo.image : default_profile}
                            href={href}
                        />
                        <Card.Content>
                            <Card.Header>{this.state.friendInfo.name}</Card.Header>
                            <Card.Meta>Friend</Card.Meta>
                            <Card.Description>{this.loadListenSimilarities()}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            {this.loadExtra()}
                        </Card.Content>
                    </Card>
            </div>
        )
    }
}
export default DashCard;