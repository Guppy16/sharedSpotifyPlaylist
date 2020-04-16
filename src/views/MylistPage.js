import React, {Component} from 'react';
import { Link } from "react-router-dom";

// import './App.css';
import queryString from 'query-string'
import request from 'request'

import Playlist from "./MylistPage/PlaylistSection.js"

const defaultStyle = {
  color: '#fff',
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

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

class MylistPage extends Component {

  constructor () {
    super();
    this.state = {
      filterString: '',
      songsSaved: false,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount () {
    
    // Refresh token? May need to set this automatically
    const parsed = queryString.parse(window.location.search);
    const accessToken = parsed.access_token;
    console.log(accessToken);
    if (!accessToken){return;}

    const userid = parsed.user_id; // only returned in deployment
    const username = parsed.username;
    console.log(userid);
    console.log(username);

    // Get user data
    if (userid){
      this.setState({user: {name: username, id: userid}});
      console.log(this.state);
      //console.log(this.state.user.id); // setstate is asynchronous, so causes debug issues
    }else{
      request.get(
      {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + accessToken },
        json: true
      }, 
      (error, response, body) => {
      console.log(body);
      this.setState({user: {name: body.display_name, id: body.id}});
      console.log(this.state);
      });
    }

    // Get collabroative playlist data
    request.get({
      url: (window.location.href.includes('localhost')
        ? 'http://localhost:8888'
        : 'https://shared-playlist-backend.herokuapp.com')
        + '/api/playlist?access_token=' + accessToken + '&user_id=' + (userid ? userid : ''),
      json: true
    }, (error, response, body) => {
      console.log("Got playlist data from api");
      console.log(body);
      this.setState({
      playlist: {
        name: body.name,
        imgUrl: body.imgUrl,
        songs: body.songs.map( (item, index) => ({
          id: item.id,
          name: item.name,
          duration: item.duration,
          score: item.score,
          render: true,
        })).sort( (a,b) => a.score - b.score),
      }
      });
      console.log(this.state);
    });
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

  // Handle Submit button
  handleClick () {
    // POST request to send order of songs
    request.post({
      url: (
        window.location.href.includes('localhost')
          ? 'http://localhost:8888' 
          : 'https://shared-playlist-backend.herokuapp.com'
          ) + '/api/playlist',
        form: {
          id: this.state.user.id,
          songs: this.state.playlist.songs,
        },
        json: true,
    },
    (error, response, body) => {
      console.log(body);
      this.setState({songsSaved: (body === "OK" ) ? true : false})   
    }
    );
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let items = reorder(
      this.state.playlist.songs,
      result.source.index,
      result.destination.index
    );

    // Update score (done on SERVER side FOR NOW)
    // const maxScore = items.length;

    // items.forEach( (item, index) => {
    //   item.score = index;
    // })

    if (items !== this.state.playlist.songs)
    {
      this.setState({songsSaved: false});
      let playlist = {...this.state.playlist};
      playlist.songs = items;
      this.setState({playlist});
    }    
    console.log(this.state);
  }

  render() {      

    let songsToRender = this.state.playlist ? this.state.playlist.songs.filter( song => song.render) : [];

    return (
      <div className="App">
        {this.state.user && this.state.playlist ?
        <div>
          <h2 style={{...defaultStyle, fontSize: '24px', paddingBottom: '20px', marginLeft: '10vw'}}> 
            {this.state.user.name}'s List
          </h2>
          <Playlist 
            playlist={this.state.playlist} 
            onTextChange={text => this.handleFilter(text)} 
            onDragEnd={this.onDragEnd} 
            handleClick={() => this.handleClick()} buttonVal ={this.state.songsSaved}
          />
        </div> 
          : <div style={{textAlign:'center', padding: '20px'}}><button onClick={() => {
              return window.location = window.location.href.includes('localhost')
                ? 'http://localhost:8888/login' 
                : 'https://shared-playlist-backend.herokuapp.com/login' }
                }
              onMouseOver={ (e) => e.target.style.border='3px solid #4CAF50' }
              onMouseLeave={ (e) => e.target.style.border='3px solid #fff' }
              style={{
                padding: '20px', fontSize: '50px', borderRadius: '5px', border: '3px solid #fff', 
            }}>
              Sign in with Spotify
            </button></div>
        }
        
      </div>
    );
  }
  
}

export default MylistPage;
