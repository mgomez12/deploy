import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import {get} from "./api";
import default_profile from "../../public/assets/default_profile.png";


class SearchBarUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            results: [],
            value: '',
            source: []
        };

        this.gotUsers=false;
        
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
                    userImage= default_profile;
                }
                return(
                    {
                        key: user._id,
                        title: user.name,
                        image: userImage                    }
                )
            }),
        })
        this.gotUsers = true;
    })
}

  handleResultSelect = (e, { result }) => {
      
      this.setState({ value: result.title })
      this.props.history.push('/u/profile/' + result.key);
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
        results: _.filter(this.state.source, isMatch),
      })
    }, 300)
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
        <div>
                <Search
                    loading={isLoading}
                    placeholder='Search for a user...'
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                    results={results}
                    value={value}
                    style={{padding:'10px'}}
                />
        </div>
    )
  }
}
export default SearchBarUser;