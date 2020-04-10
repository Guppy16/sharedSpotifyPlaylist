import React, {Component} from 'react';
// import {TextInput} from 'react-native';
import logo from './logo.svg';
import 'reset-css/reset.css';
import './App.css';
import queryString from 'query-string'
import request from 'request'
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
//const superagent = require('superagent');

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

function PlaylistHeader (props) {
  let totalDuration = props.playlist.songs.reduce((sum, song) => {
    return sum + song.duration;
  }, 0);
  totalDuration = Math.round(totalDuration/1000/60);
  const numOfSongs = props.playlist.songs.length
  return (
    <div style={{...defaultStyle, width: "auto", marginLeft: '0vw'}}>
      <img src={props.playlist.imgUrl} className='PlaylistImg'/>
      <div style={{display: 'inline-block', verticalAlign: 'top', height: "140px"}}>
        <p style={{
          textAlign: 'center', fontSize: '30px', padding: '10px', fontWeight:'bold', 
        }}>
          {props.playlist.name}
        </p>
        <p style={{textAlign: 'left'}}>
        {numOfSongs} songs <br/>
        Duration: {totalDuration} mins
        </p>
      </div>
    </div>
    );
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

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8; // Used for padding

const getItemStyle = (isDragging, draggableStyle, inFilter) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  margin: `0 0 ${grid}px 0`,

  // change padding based on filter
  padding: inFilter ? grid * 2 : grid,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : inFilter? "green" : "darkseagreen",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "#202020" : "black",
  padding: grid,
  width: '75vw'
});

class SongList extends Component {
  render () {
    return (
      <DragDropContext onDragEnd={this.props.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.props.songs.map((song, index) => (
                  <Draggable key={song.id} draggableId={song.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                          song.render,
                        )}
                      >
                        {song.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
    );
  }
}

class Playlist extends Component {

  render () {

    const items = this.props.playlist.songs.map( song => ({
      id: song.id,
      content: song.name,
    }));

    return (
      <div style={{...defaultStyle, marginLeft: '10vw'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent: 'space-between'}}>
        <div style={{display: 'inline-block'}}>
          <PlaylistHeader playlist={this.props.playlist} />
          <Filter onTextChange={text => this.props.onTextChange(text)}/>
        </div>
        <div style={{display: 'inline-block', marginLeft:'10vw', textAlign: 'center'}}>
        <button onClick={() => this.props.handleClick()} 
          onMouseOver={ (e) => e.target.style.border='3px solid #4CAF50' }
          onMouseLeave={ (e) => e.target.style.border='3px solid #fff' } 
          style={{ width:'20vw', padding:'20px', borderRadius: '5px', border: '3px solid #fff', 
          fontSize: '25px', fontWeight: 'bold'
        }}>
          Save
        </button>
        <p style={{
          padding: '11px', fontStyle: 'italic',
        }}>You can change your response later</p>
        </div>
      </div>
      <SongList onDragEnd={this.props.onDragEnd} songs={this.props.playlist.songs} />
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
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount () {
    
    // Refresh token? May need to set this automatically
    const parsed = queryString.parse(window.location.search);
    const accessToken = parsed.access_token;
    console.log(accessToken);
    if (!accessToken){return;}

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
      url: (window.location.href.includes('localhost')
        ? 'http://localhost:8888' 
        : 'https://shared-playlist-backend.herokuapp.com')
      + '/api/playlist?access_token=' + accessToken,
      json: true
    },
    (error, response, body) => {
      console.log(body);
      this.setState({playlist: {
        name: body.name,
        imgUrl: body.images[0].url, 
        songs: body.tracks.items.map(item => ({
          id: item.track.id,
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
          id: this.state.user.name,
          songs: this.state.playlist.songs,
        },
        json: true,
    },
    (error, response, body) => {
      console.log(body);
    }
    );
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.playlist.songs,
      result.source.index,
      result.destination.index
    );

    let playlist = {...this.state.playlist};
    playlist.songs = items;
    this.setState({playlist});
  }

  render() {      

    let songsToRender = this.state.playlist ? this.state.playlist.songs.filter( song => song.render) : [];

    return (
      <div className="App">
        <h1 style={{...defaultStyle, fontSize: '54px', padding: '20px', textAlign:'center'}}>
          Shared Spotify Playlist
        </h1>
        {this.state.user && this.state.playlist ?
        <div>
          <h2 style={{...defaultStyle, fontSize: '24px', paddingBottom: '20px', marginLeft: '10vw'}}> 
            {this.state.user.name}'s List
          </h2>
          <Playlist 
            playlist={this.state.playlist} onTextChange={text => this.handleFilter(text)} 
            onDragEnd={this.onDragEnd} handleClick={() => this.handleClick()}
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
        <footer className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by React
          </a>
        </footer>
      </div>
    );
  }
  
}

export default App;
