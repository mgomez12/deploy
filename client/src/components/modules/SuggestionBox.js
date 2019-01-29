import React, { Component } from "react";
import "../../public/css/styles.css";
import { Card, Feed, Loader, Header } from "semantic-ui-react";
import { get } from './api'
import SuggestionEntry from './SuggestionEntry';

class SuggestionBox extends Component {
	constructor(props) {
        super(props);

        this.state = {
            suggestions:[]
        };
    }

    componentDidMount() {
        get('/api/suggestion', {receiver: this.props.userInfo._id, limit:10}, (suggestionArray) => {
            this.setState({
                suggestions: suggestionArray
            })
        })
    }
        
    render() {

        if (this.props.userInfo.access_token == null) {
            return(<Loader size='massive'/>)
        }
        
        return (
            <Card style={{width:"85%", height:"80%"}}>
                <Card.Header as='h3' style={{padding:'4px'}}>
                    Recent Suggestions
                </Card.Header>
                <Card.Content style={{overflow:'scroll'}}>
                <Feed size='small' >
                {this.state.suggestions.length !== 0 ? this.state.suggestions.map( suggestion => {
                    return <SuggestionEntry key={suggestion._id} userInfo={this.props.userInfo} sug={suggestion}/>
                }) : <Header as='h3' className='center-image' style={{color:'gray'}}>You have no song suggestions. Ask your friends for song recommendations!</Header>}
                </Feed>
                </Card.Content>
            </Card>
        )
    }
}
export default SuggestionBox;