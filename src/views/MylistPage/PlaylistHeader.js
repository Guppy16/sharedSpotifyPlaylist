import React, {Component} from 'react';

const defaultStyle = {
	color: '#fff',
}

export default function PlaylistHeader (props) {
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
				{totalDuration} mins
				</p>
			</div>
		</div>
		);
}