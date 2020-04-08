import React, {Component} from 'react';
import logo from './logo.svg';
import 'reset-css/reset.css';
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
        <h2 style={{color: '#fff'}}>Playlist Duration: {totalDuration} mins</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style= {{padding: '5px', height: '40px', verticalAlign: "bottom"}}>
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)}
        placeholder="Filter"
        style= {{padding: '0px',}}
        />
      </div>
    );
  }
}

class Song extends Component {
  render () {
    return (
      <button className="song" onClick={this.props.onClick} style={{
        fontSize: '15px',
        padding: '3px',
      }, 
      this.props.renderVal ? {color: 'green'} : {backgroundColor: 'rgba(255,255,255,0.9)',}  
      }>
        {this.props.value}
      </button>
    );
  }
}

class Playlist extends Component {
  render () {
    let totalDuration = this.props.playlist.songs.reduce((sum, song) => {
      return sum + song.duration;
    }, 0);
    totalDuration = Math.round(totalDuration/1000/60);
    const numOfSongs = this.props.playlist.songs.length
    return (
      <div>
      <div style={{...defaultStyle, width: "auto"}}>
        <img src={this.props.playlist.imgUrl} className='PlaylistImg'/>
        <div style={{display: 'inline-block', verticalAlign: 'top', height: "140px"}}>
          <p style={{
            textAlign: 'center', fontSize: '30px', padding: '10px', fontWeight:'bold', 
          }}>
            {this.props.playlist.name}
          </p>
          <p style={{textAlign: 'left'}}>
          {numOfSongs} songs <br/>
          Duration: {totalDuration} mins
          </p>
        </div>
      </div>
      <Filter onTextChange={text => this.props.onTextChange(text)}/>
      <div>
        <ul style={{textAlign: 'left'}}>
          {/* may hav to had a key to each item*/}
          {this.props.playlist.songs.map( song => 
            <li key={song.name}>
              <Song value={song.name} renderVal={song.render}/>
            </li>
          )} 
        </ul>
      </div>
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
        <h1 style={{...defaultStyle, fontSize: '54px', padding: '20px'}}>
          Shared Spotify Playlist
        </h1>
        {this.state.user && this.state.playlist ?
        <div>
          <h2 style={{...defaultStyle, fontSize: '24px', paddingBottom: '20px'}}> 
            {this.state.user.name}'s List
          </h2>
          {/* {<SongCounter songs={songsToRender} />
          <HoursCounter songs={songsToRender}/>} */}
          
          <Playlist playlist={this.state.playlist} onTextChange={text => this.handleFilter(text)}/>
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
