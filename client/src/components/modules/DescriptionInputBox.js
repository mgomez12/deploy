import React, { Component } from 'react';
import "../../public/css/styles.css"
import { Message, Input, Loader, Checkbox, Form, TextArea, Button } from 'semantic-ui-react';
import { post } from "./api"

    // loadDescriptionBox() {
    //     if(this.gotProfileInfo) {
    //         if(this.props.match.params.user==this.state.userInfo._id){
    //             if(this.userInfo.descrip!==null){
    //                 return (
    //                     <Container>
    //                     <p>
    //                     {this.userInfo.descrip}
    //                     </p>
    //                     </Container>);
    //             }
    //             else{
    //                 return(
    //                     <Form>
    //                         <Form.Field control={TextArea} label='About Me' placeholder='Tell us more about you...' />
    //                         <Form.Field control={Button}>Submit</Form.Field>
    //                     </Form>
                        
    //                 );
    //                 <SuggestionForm userId={this.props.viewerInfo._id} receiverId={this.state.userInfo._id} isTrack={true}/>
    //             }
    //         }
    //     else {
    //         <Loader active inline />
    //     }
    // }
    // }
class DescriptionInputForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: '',
            submitted: false,
            response: null,
        };
        this.handleChange = this.handleChange.bind(this)
        this.submitDescription = this.submitDescription.bind(this)
        // this.checkboxChange = this.checkboxChange.bind(this)

    }

    handleChange(event){
        this.setState({
            input: event.target.value,
        })
    }

    // checkboxChange(event, data) {
    //     console.log(data)
    //     if (data.checked == null) {
    //         return
    //     }
    //     this.setState({
    //         anonymous: data.checked
    //     })
       
    // }

    submitDescription() {
        const input = this.state.input
        this.setState({
            input: '',
            submitted: true,
            response: null
        })
        const date = new Date()
        // if (!this.props.isTrack) {
            console.log('submitted' + this.props.userId + input)
            post('/api/description', {user_id: this.props.userId, bio:input, time:date},
            (response) => {
                console.log(response);
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
        // }
        // else {
        // console.log('submitted' + this.props.userId + this.props.receiverId)
        // post('/api/description', {user_id: this.props.userId, bio: input, time:date})
        // }
    }

    render() {
        let banner;
        if (this.state.submitted) {
            console.log(this.state.response)
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
            <Form.Field
                control={TextArea}
                action={{ color: 'teal', content: 'submit', onClick: this.submitDescription}}
                placeholder="Type in your bio!"
                value={this.state.input}
                onChange={this.handleChange}
            />
            <Form.Field control={Button}>Submit</Form.Field>
            {banner}
            </div>
            {/* <Checkbox toggle label='Submit anonymously' onClick={this.checkboxChange}/> */}
            </React.Fragment>
        )
    }
}
export default DescriptionInputForm;