import _ from 'lodash'
import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Image, Search, Message, Input, Loader, Checkbox } from 'semantic-ui-react';
import { post, get } from "./api"
import default_profile from "../../public/assets/default_profile.png";
import happy_llama from "../../public/assets/happy_llama.png";
import sad_llama from "../../public/assets/sad_llama.png";
import circle_llama from "../../public/assets/circle_llama.png";



class SuggestionFormUser extends Component {
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
    this.getUsers()
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  getUsers() {
    fetch('/api/allusers').then(res => res.json())
    .then((users) => {
        this.setState({
            source: users.map( user => {
                var userImage = user.image;
                if(user.image=="") {
                    userImage= circle_llama;
                }
                return(
                    {
                        key: user._id,
                        title: user.name,
                        image: userImage,
                        uri: this.props.track.uri
                    })
            }),
        })
        this.gotUsers = true;
    })
}

  handleResultSelect = (e, { result }) => {
      
      this.setState({ value: result.title })
      this.submitSuggestion(result);
      this.resetComponent();
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch).slice(0,5),
      })
    }, 300)
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
        if(input == this.props.userInfo._id) {
            this.setState({
                value: '',
                submitted: true,
                response: false
            })
            return 
        }
        this.setState({
            value: '',
            submitted: true,
            response: null
        })
        const date = new Date()
        if (!this.props.isTrack) {
            post('/api/suggestion', {receiver: input, sender: (this.state.anonymous? 'anonymous' : this.props.userInfo._id), track: this.props.track.id, uri: result.uri, time:date},
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
                banner=<Message compact positive><Message.Header>Submitted!<Message.Content><Image size='mini' centered src={happy_llama}/></Message.Content></Message.Header></Message>
            }
            else {
                banner=<Message compact negative><Message.Header>Failed!<Message.Content><Image size='mini' centered src={sad_llama}/></Message.Content></Message.Header></Message>
            }
        }
        else {
            banner=''
        }
        return(
            <React.Fragment>
            <div style={{display:'inline-block', padding:'8px'}}>
            <Search
                    loading={isLoading}
                    placeholder='Find a user..'
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={results}
                    value={value}
                />
            {banner}
            </div>
            <br/>
            <Checkbox toggle label='Submit anonymously' onClick={this.checkboxChange}/>
            </React.Fragment>
        )
    }
}
export default SuggestionFormUser;