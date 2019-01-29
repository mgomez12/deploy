import React, { Component } from "react";
import "../../public/css/styles.css";
import { Icon, Image, Loader, Card} from "semantic-ui-react";
import { Link} from 'react-router-dom';
import default_profile from "../../public/assets/default_profile.png";
import circle_llama from "../../public/assets/circle_llama.png";
import confused_llama from "../../public/assets/confused_llama.png";
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
            return (
                    <Loader active size='large'>Loading<Image size='tiny' centered src={confused_llama}/></Loader>
            )
        }
        var href = "/u/profile/" + this.state.friendInfo._id;
        return (
            <div style={{marginLeft:'auto', marginRight:'auto', paddingBottom:'8px'}}>
                <Card
                    link
                    color="teal"
                    raised>
                        <Image 
                            src={this.state.friendInfo.image !== '' ? this.state.friendInfo.image : circle_llama}
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