import React, {Component} from 'react';
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import PlaylistHeader from "./PlaylistHeader.js";
import SongList from "../../components/DndList.js";

const defaultStyle = {
	color: '#fff',
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

class Playlist extends Component {

	render () {

		const items = this.props.playlist.songs.map( song => ({
			id: song.id,
			content: song.name,
		}));

		return (
			<div style={{...defaultStyle, marginLeft: '10vw', marginRight: '10vw'}}>
			<div style={{display:'flex', alignItems:'center', justifyContent: 'space-between'}}>
				<div style={{display: 'inline-block'}}>
					<PlaylistHeader playlist={this.props.playlist} />
					<Filter onTextChange={text => this.props.onTextChange(text)}/>
				</div>
				<div style={{display: 'inline-block', textAlign: 'center'}}>
				<button onClick={() => this.props.handleClick()} 
					onMouseOver={ (e) => e.target.style.border='3px solid #4CAF50' }
					onMouseLeave={ (e) => e.target.style.border='3px solid #fff' } 
					style={{ width:'20vw', padding:'3px', borderRadius: '3px', border: '3px solid #fff', 
					fontSize: '22px', fontWeight: 'bold'
				}}>
					{ this.props.buttonVal ? "Saved" : "Save"}
				</button>
				<p style={{
					padding: '9px', fontStyle: 'italic',
				}}>You can change your response later</p>
				</div>
			</div>
			<SongList onDragEnd={this.props.onDragEnd} items={this.props.playlist.songs} />
			</div>
		);
	}
}

export default Playlist;