import _ from 'lodash'
import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Search, Message, Input, Loader, Checkbox } from 'semantic-ui-react';
import { post, get } from "./api"

class SuggestionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            results: [],
            value: '',
            source: [{
                title: "Jeffrey Chen",
                image: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=234005436790515&height=200&width=200&ext=1550675248&hash=AeQ2vzL0Qc9aF3s7"
            }],
            input: '',
            submitted: false,
            response: null,
            anonymous: false
        };
        this.submitSuggestion = this.submitSuggestion.bind(this)
        this.checkboxChange = this.checkboxChange.bind(this)
    }

  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => {
      
      this.setState({ value: result.title })
      this.submitSuggestion(result);
      this.resetComponent();
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value: value })

    setTimeout(() => {
        this.updateSourceTracks(value);
        this.render();
    }, 300)

  }

  updateSourceTracks(value) {
    if (value.length < 1) return this.resetComponent() 
    const obj = this;
    var query = value.replace(/ /g,"%20")
    var artistHeader = [['Authorization', 'Bearer ' + this.props.userInfo.access_token]];
    get('https://api.spotify.com/v1/search?q=' + query + '&type=track&market=US&limit=5', null, function(searchData) {
        const compiled = searchData.tracks.items.map( track => {
            return(
                {
                    key: track.id,
                    title: track.name,
                    image: track.album.images[0].url,
                    description: track.album.artists[0].name,
                    uri: track.uri
                }
            );
        });
        obj.setState({
            isLoading: false,
            results: compiled
        })
    }, null, artistHeader);
  }
    checkboxChange(event, data) {
        if (data.checked == null) {
            return
        }
        this.setState({
            anonymous: data.checked
        })
       
    }

    submitSuggestion(result) {
        const input = result.key
        this.setState({
            value: '',
            submitted: true,
            response: null
        })
        const date = new Date()
        if (!this.props.isTrack) {
            post('/api/suggestion', {receiver: input, sender: (this.state.anonymous? 'anonymous' : this.props.userInfo._id), track: this.props.track, uri: result.uri, time:date},
            (response) => {
                if (response.status =='success') {
                    this.setState({
                        response: true
                    })
                    return
                }
                this.setState({
                    response: false
                })
            })
        }
        else {
        post('/api/suggestion', {receiver: this.props.receiverId, sender: (this.state.anonymous? 'anonymous' : this.props.userInfo._id), track: input, uri: result.uri, time:date},
        (response) => {
            if (response.status =='success') {
                this.setState({
                    response: true
                })
                return
            }
            this.setState({
                response: false
            })
        })
        }
    }
    render() {
        let banner;
        const { isLoading, value, results } = this.state

        if (this.state.submitted) {
            if (this.state.response == null) {
                banner=<Message compact ><Loader active size='medium'/></Message>
            }
            else if (this.state.response) {
                banner=<Message compact positive><Message.Header>Submitted!</Message.Header></Message>
            }
            else {
                banner=<Message compact negative><Message.Header>Failed!</Message.Header></Message>
            }
        }
        else {
            banner=''
        }
        return(
            <React.Fragment>
            <div style={{display:'inline-block'}}>
            <Search
                    loading={isLoading}
                    placeholder='Suggest a song...'
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={results}
                    value={value}
                />
            {banner}
            </div>
            <Checkbox toggle label='Submit anonymously' onClick={this.checkboxChange}/>
            </React.Fragment>
        )
    }
}
export default SuggestionForm;