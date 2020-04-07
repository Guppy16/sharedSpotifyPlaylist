import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import queryString from 'query-string'
import request from 'request'

let defaultTextColor = '#fff'
let defaultStyle = {
  color: defaultTextColor,
}

let fakeServerData = {
  user: {
    name: 'Akash',
    playlists: [
      { // Playlist 1 for the current songs added
        name: "Fav1",
        songs: [
          {name: 'Son1', duration: 120},
          {name: 'Song 2', duration: 69}, 
          {name:'Song3', duration: 42},
        ]
      },
      { // Playlist for the previous songs
        name: "Fav2",
        songs: [
          {name: 'Son1', duration: 120},
          {name: 'Song2', duration: 42}, 
          {name:'Song3', duration: 69},
        ]
      }
    ]
  }
};

class SongCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2 style={{color: '#fff'}}>{this.props.songs.length} Songs</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let totalDuration = this.props.songs.reduce((sum, song) => {
      return sum + song.duration;
    }, 0)
    totalDuration = Math.round(totalDuration/1000/60)

    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2 style={{color: '#fff'}}>Playlist Duration: {totalDuration} minutes</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={{color: defaultTextColor}}>
        <img></img>
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render () {
    return (
      <div style={{...defaultStyle, width: "75%", display: 'inline-block'}}>
        <img src={this.props.playlist.imgUrl} style={{height:"100px", display: 'inline-block'}}/>
        <h2 style={{textAlign: 'middle', display: 'inline-block'}}>{this.props.playlist.name}</h2>
        <ul style={{textAlign: 'left'}}>
          {/* may hav to had a key to each item*/}
          {this.props.playlist.songs.map( song => <li>{song.name}</li>)} 
        </ul>
      </div>
    );
  }
}

class App extends Component {

  constructor () {
    super();
    this.state = {
      filterString: '',
    };
  }

  componentDidMount () {
    
    // Refresh token? Somehwere else
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    console.log(accessToken);
    if (!accessToken){return;}
    
    // Fetch data from API (using DevTips implementation) [does NOT work!]
    // fetch (
    //   'https://api.spotify.com/v1/me', 
    //   {headers: {'Authorization': 'Bearer' + accessToken}}
    // ).then(response =>
    //     response.json()).then(data => console.log(data))

    // Fetch data from API (using spotify implementation)
    // Get user data
    request.get(
      {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + accessToken },
        json: true
      }, 
      (error, response, body) => {
      console.log(body);
      this.setState({user: {name: body.display_name}})
    });

    // Get collabroative playlist data
    request.get({
        url: 'https://api.spotify.com/v1/playlists/7JJzP95ARTN2A08g7xahXD',
        headers: { 'Authorization': 'Bearer ' + accessToken },
        json: true
      }, 
      (error, response, body) => {
        console.log(body);
        this.setState({playlist: {
          name: body.name,
          imgUrl: body.images[0].url, 
          songs: body.tracks.items.map(item => ({
            name: item.track.name,
            duration: item.track.duration_ms,
            render: true,
          })),
        }})
        console.log(this.state);
        }
    );

    // setTimeout ( () => {this.setState({serverData:fakeServerData});}, 1000);
    // setTimeout ( () => {this.setState({filterString:'fav2'});}, 1200); // To test filtering
  }

  handleFilter(inpText) {

    this.setState({filterString: inpText})

    const songsToRender = 
      this.state.user &&
      this.state.playlist &&
      this.state.playlist.songs
        ? this.state.playlist.songs.filter( song =>
          song.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())) 
        : [] ;
    
    let playlist = {...this.state.playlist}
    playlist.songs.forEach( 
      (song) => {song.render = songsToRender.includes(song) ? true : false}
    );
    this.setState({playlist});

  }

  render() {      

    let songsToRender = this.state.playlist ? this.state.playlist.songs.filter( song => song.render) : [];

    return (
      <div className="App">
        <h1>Shared Spotify Playlist</h1>
        {this.state.user && this.state.playlist ?
        <div>
          <h2> {this.state.user.name}' List</h2>
          <SongCounter songs={songsToRender} />
          <HoursCounter songs={songsToRender}/>
          <Filter onTextChange={text => this.handleFilter(text)}/>
          <Playlist playlist={this.state.playlist} />
        </div> : <button onClick={() => window.location = window.location.href.includes('localhost')
          ? 'http://localhost:8888/login' : 'https://shared-playlist-backend.herokuapp.com/login' }
          style={{padding: '20px', 'fontSize': '50px'}}>Sign in with Spotify</button>
        }
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
  
}

export default App;
