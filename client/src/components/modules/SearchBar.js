import _ from 'lodash'
import faker from 'faker'
import io from 'socket.io-client';
import React, { Component } from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'
import {get} from "../modules/api";


class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://localhost:3000');


        // this.source = _.times(5, () => ({
        //     title: faker.company.companyName(),
        //     description: faker.company.catchPhrase(),
        //     image: faker.internet.avatar(),
        //     price: faker.finance.amount(0, 100, 2, '$'),
        //   }))
        
        this.state = {
            isLoading: false,
            results: [],
            value: '',
            source: [{
                title: "Jeffrey Chen",
                image: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=234005436790515&height=200&width=200&ext=1550675248&hash=AeQ2vzL0Qc9aF3s7"
            }]
        };
        console.log(this.state.source);
    }

  componentWillMount() {
    this.resetComponent()
  }

  componentWillUpdate() {
      this.updateSourceTracks();
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })
    this.updateSourceTracks();

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)
      console.log("start")
        
      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
      })

    }, 300)
  }

  updateSourceTracks() {
    const obj = this;
    var artistHeader = [['Authorization', 'Bearer ' + this.props.userInfo.access_token]];
    console.log('token: ' + this.props.userInfo.access_token)
    get('https://api.spotify.com/v1/search?q=' + this.state.value + '&type=track&market=US', null, function(searchData) {

        console.log('search data in get: ' + searchData.tracks.items[0].name)
        const compiled = searchData.tracks.items.map( track => {
            return(
                {
                    title: track.name,
                    image: track.album.images[0].url
                }
            );
        });
        console.log(compiled)
        obj.setState({
            source: compiled
        })
    }, null, artistHeader);
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
            results={results}
            value={value}
          />
    )
  }
}
export default SearchBar;