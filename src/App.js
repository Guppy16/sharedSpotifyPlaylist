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

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2 style={{color: '#fff'}}>No of playlists: {this.props.playlists.length}</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce( (songs, playlist) => {
      return songs.concat(playlist.songs)
    }, []);
    let totalDuration = allSongs.reduce((sum, song) => {
      return sum + song.duration;
    }, 0)

    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2 style={{color: '#fff'}}>{totalDuration} minutes</h2>
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
    let playlist = this.props.playlist;
    return (
      <div style={{...defaultStyle, width: "25%", display: 'inline-block', textAlign: 'left'}}>
        <img />
        <h3 style={{textAlign: 'center'}}>{playlist.name}</h3>
        <ul>
          {/* may hav to had a key to each item*/}
          {playlist.songs.map( song => <li>{song.name}</li>)} 
        </ul>
      </div>
    );
  }
}

class App extends Component {

  constructor () {
    super();
    this.state = {
      serverData: {},
      filterString: '',
    };
  }

  componentDidMount () {
    // Wrap in set timeout to simulate the loading
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    console.log(accessToken)
    
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

    // Get playlist data
    request.get({
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: { 'Authorization': 'Bearer ' + accessToken },
        json: true
      }, 
      (error, response, body) => {
      console.log(body);
      this.setState({playlists: body.items.map(item => ({
        name:item.name,
        songs: [],
      }))})
      }
    );

    // setTimeout ( () => {this.setState({serverData:fakeServerData});}, 1000);
    // setTimeout ( () => {this.setState({filterString:'fav2'});}, 1200); // To test filtering
  }

  render() {
    let playlistToRender = 
      this.state.user &&
      this.state.playlists
        ? this.state.playlists.filter( playlist =>
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())) 
        : []
    return (
      <div className="App">
        <h1>Shared Spotify Playlist</h1>
        {this.state.user ?
        <div>
          <h2> {this.state.user.name}' List</h2>
          <PlaylistCounter playlists={playlistToRender} />
          <HoursCounter playlists={playlistToRender}/>
          <Filter onTextChange={text => this.setState({filterString: text})}/>
          {
            playlistToRender.map( playlist => 
            <Playlist playlist = {playlist}/>
            )}
        </div> : <button onClick={() => window.location = 'http://localhost:8888/login'}
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
